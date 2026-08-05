// Express route for handling monitoring configuration
const express = require('express');

// Create a new router instance
const router = express.Router();

/**
 * Receives monitoring configuration from WordPress.
 */
const { syncConfig } = require('../../services/configSync');

// Define a POST route for syncing configuration
router.post('/', async (req, res) => {

        console.log('CONFIG POST HIT');

    try {

        const result = await syncConfig(req.body);

        res.status(200).json(result);

    } catch (error) {

        console.error(
            'Config sync failed:',
            error
        );

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;