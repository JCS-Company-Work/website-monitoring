// Pull in database instance
const db = require('../db/database');

// Pull in the test runner
const { runTests } = require('../runner/testRunner');

// Update test schedule query
const { updateSchedule } = require('../db/queries/tests');
const { getNextRun } = require('../utils/schedule');

/**
 * Gets all tests that are due to run.
 *
 * @returns {Array<Object>}
 */
function getDueTests() {

    return db.prepare(`
        SELECT *
        FROM tests
        WHERE enabled = 1
        AND next_run_at <= datetime('now')
    `).all();

}

/**
 * Runs any tests that are due.
 */
async function checkTests() {

    const tests = getDueTests();
console.log('Checking for due tests...');
console.log('Due tests:', tests.map(test => test.slug));
    if (!tests.length) {
        return;
    }

    console.log(
        'Tests due:',
        tests.map(test => test.slug)
    );

    for (const test of tests) {

        console.log(
            'Running test:',
            test.slug
        );

        try {

            // Run the test using the Playwright runner
            await runTests(
                test.file,
                test.slug
            );

        } finally {

            // Update the test's next run time in the database
            updateSchedule(
                test.id,
                new Date().toISOString(),
                getNextRun(test.schedule)
            );

        }

    }

}

/**
 * Starts the monitoring worker.
 */
function startWorker() {

    console.log('Monitoring worker started');

    // Check for due tests immediately on startup
    checkDueTests();

    // Check for due tests every minute
    setInterval(() => {
        checkDueTests();
    }, 60000);

}

module.exports = {
    startWorker
};