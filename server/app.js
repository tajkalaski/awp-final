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
    { url: '/api/login', methods: ['POST'] },
    { url: '/api/register', method: ['POST']},
    { url: '/api/suggestions', method: ['GET']},
    { url: '/api/suggestions/*', method: ['GET']},
    { url: '/', method: ['GET'] },
    { url: /^\/suggestions\/.*/, method: ['GET', 'POST'] }
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
const userRoutes = require('./routers/userRoutes')(secret);
app.use('/', userRoutes);

const suggestionsRoutes = require('./routers/suggestionsRoutes')(suggestionsDb);
app.use('/', suggestionsRoutes);

// if the route doesnt exist move it soemwhere more meaningful
app.get("*", (req, res) =>
    res.sendFile(path.join(buildPath, "index.html"))
);

/**** Start! ****/
const url = process.env.MONGO_URL || 'mongodb://localhost/db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await suggestionsDb.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`Suggestions API running on port ${port}!`);
    })
    .catch(error => console.error(error));
