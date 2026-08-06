// Load environment variables from .env file
require('dotenv').config();

// Import the authentication middleware
const { authenticate } = require('./api/middleware/auth');

// Express server setup
const express = require('express');

// Import the config routes
const configRoutes = require('./api/routes/config');

// Import route to retrieve available tests
const testsRoutes = require('./api/routes/tests');

// Create an Express application
const app = express();

// Use JSON middleware to parse incoming JSON requests
app.use(express.json());

// Mount the config routes at the /api/config path
app.use(
    '/api/tests/sync',
    authenticate,
    configRoutes
);

// Mount the tests routes at the /api/tests path
app.use(
    '/api/tests/available',
    authenticate,
    testsRoutes
);

// Start the server on the specified port
const PORT = process.env.API_PORT || 3001;

// Start the server and listen on the specified port
app.listen(PORT, () => {

    console.log(
        `Monitoring API listening on port ${PORT}`
    );

});

// Start the server on the specified port
module.exports = app;