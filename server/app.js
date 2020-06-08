/**** External libraries ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**** Configuration ****/
const appName = "Suggestion Box Project";
const port = (process.env.PORT || 8080);

const app = express();
const buildPath = path.join(__dirname, '..', 'client', 'build');

app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all http requests to the console
app.use(express.static(buildPath)); // Serve React from build directory


// Open paths that do not need login. Any route not included here is protected!
let openPaths = [
    { url: '/login', methods: ['POST'] }
];

const secret = process.env.SECRET || "i want a cat";
app.use(expressJwt({ secret: secret }).unless({ path: openPaths}));

// I'll mock the users for now because yes
let users = [
    {
        id: 1,
        username: 'tajsonik',
        password: 'asdf123'
    },
    {
        id: 2,
        username: 'tajsoniktest2',
        password: 'abc456'
    }
];

// Creating more test data: We run through all users and add a hash of their password to each.
// In practice, you should hash when passwords are created, not later.
users.forEach(async user => {
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) reject(err); else resolve(hash);
        });
    });

    user.hash = hashedPassword; // The hash has been made, and is stored on the user object.
    delete user.password; // Let's remove the clear text password (it shouldn't be there in the first place)
    console.log(`Hash generated for ${user.username}:`, user); // Logging for debugging purposes
});


app.use((req, res, next) => {
    // Additional headers for the response to avoid trigger CORS security errors in the browser
    // Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // Intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      // Always respond with 200
      console.log("Allowing OPTIONS");
      res.send(200);
    } else {
      next();
    }
});
/*** Database ***/
const suggestionsDb = require('./db')(mongoose);

/**** Routes ****/

// Get all suggestions (basic)
app.get('/api/suggestions', async (req, res) => {
    const suggestions = await suggestionsDb.getSuggestions()
    res.json(suggestions)
});

// Get single suggestion (basic)
app.get('/api/suggestions/:id', async (req, res) => {
    let id = req.params.id
    const suggestion = await suggestionsDb.getSuggestion(id);
    res.json(suggestion);
});

// Add new suggestion (full version)
app.post('/api/suggestions', async (req, res) => {
    let suggestion = {
        id: Math.random(),
        text: req.body.suggestionText,
        signatures: [{ text: String, date: Date }],
    };

    const newSuggestion = await suggestionsDb.postSuggestion(suggestion);
    res.json(newSuggestion);
})

// Post a signature (basic)
app.post('/api/suggestions/:id/signatures', async (req, res) => {
    let suggestionId = req.params.id;
    let signature = {
        id: Math.random(),
        text: req.body.text,
        date: new Date()
    }
    const updatedSuggestion = await suggestionsDb.postSignature(suggestionId, signature);
    res.json(updatedSuggestion);

});

// login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
        let msg = "Username or password missing!";
        console.error(msg);
        res.status(401).json({msg: msg});
        return;
    }

    const user = users.find((user) => user.username === username);
        if (user) { // If the user is found
            bcrypt.compare(password, user.hash, (err, result) => {
                if (result) { // If the password matched
                    const payload = { username: username };
                    const token = jwt.sign({ username: username }, 'i want a cat', { expiresIn: '1h' });

                    res.json({
                        msg: `User '${username}' authenticated successfully`,
                        token: token
                    });
                }
                else res.status(401).json({msg: "Password mismatch!"})
            });
        } else {
            res.status(404).json({msg: "User not found!"});
        }
});


// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
// CHANGE THE BUILD PATH!
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(buildPath, 'index.html'));
// });

/**** Start! ****/
const url = process.env.MONGO_URL || 'mongodb://localhost/db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await suggestionsDb.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`Suggestions API running on port ${port}!`);
    })
    .catch(error => console.error(error));
