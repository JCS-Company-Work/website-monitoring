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

        }  catch (error) {

            console.error(error);

        } finally {

            // Update the test's next run time in the database
            updateSchedule(
                test.id,
                new Date().toISOString()
                .slice(0, 19)
                .replace('T', ' '),
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
    checkTests();

    // Check for due tests every minute
    setInterval(() => {
        checkTests();
    }, 60000);

}

module.exports = {
    startWorker
};