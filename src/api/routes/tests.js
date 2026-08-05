// Route for retrieving available tests
const express = require('express');

// Create a new router instance
const router = express.Router();

const {
    availableTests
} = require('../../services/availableTests');


router.get('/', (req, res) => {

    const tests = availableTests();

    res.json({
        tests
    });

});


module.exports = router;