// Express route for handling monitoring configuration
const express = require('express');

// Create a new router instance
const router = express.Router();

/**
 * Receives monitoring configuration from WordPress.
 */
router.post('/', (req, res) => {

    console.log(req.body);

    res.sendStatus(200);

});

module.exports = router;