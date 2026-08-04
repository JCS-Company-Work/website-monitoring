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

        // Run the test using the Playwright runner
        await runTests(
            test.file,
            test.slug
        );

        // Update the test's next run time in the database
        updateSchedule(
            test.id,
            new Date().toISOString(),
            getNextRun(test.schedule)
        );

    }

}

/**
 * Starts the monitoring worker.
 */
function startWorker() {

    console.log('Monitoring worker started');

    setInterval(() => {

        checkTests();

    }, 60000);

}

module.exports = {
    startWorker
};