// Pull in the database instance
const db = require('../database');

// Insert statement for creating a new test execution
const insertExecution = db.prepare(`
    INSERT INTO test_executions (
        started_at,
        trigger,
        status
    )
    VALUES (?, ?, ?)
`);


/**
 * Creates a new test execution.
 *
 * @param {string} trigger How the run was started
 * @returns {number} Execution ID
 */
function createExecution(trigger = 'manual') {

    const result = insertExecution.run(
        new Date().toISOString(),
        trigger,
        'running'
    );

    return result.lastInsertRowid;
}


module.exports = {
    createExecution
};