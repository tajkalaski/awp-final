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
    { url: '/login', methods: ['POST'] },
    { url: '/register', method: ['POST']},
    { url: '/api/suggestions', method: ['GET']},
    { url: '/api/suggestions/:id', method: ['GET']}
];

const secret = process.env.SECRET || "i want a cat";
app.use(expressJwt({ secret: secret }).unless({ path: openPaths}));


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

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
// CHANGE THE BUILD PATH!
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(buildPath, 'index.html'));
// });

/**** Routes ****/
const userRoutes = require('./routers/userRoutes')(secret);
app.use('/', userRoutes);

const suggestionsRoutes = require('./routers/suggestionsRoutes')(suggestionsDb);
app.use('/', suggestionsRoutes);

/**** Start! ****/
const url = process.env.MONGO_URL || 'mongodb://localhost/db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await suggestionsDb.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`Suggestions API running on port ${port}!`);
    })
    .catch(error => console.error(error));
