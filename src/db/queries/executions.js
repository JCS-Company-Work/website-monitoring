// Pull in the database instance
const db = require('../database');

/**
 * Creates a new test execution.
 *
 * @param {string} trigger How the run started
 * @returns {number} Execution ID
 */
function createExecution(trigger = 'manual') {

    const result = db.prepare(`
        INSERT INTO test_executions (
            started_at,
            trigger,
            status
        )
        VALUES (?, ?, ?)
    `).run(
        new Date().toISOString(),
        trigger,
        'running'
    );

    return result.lastInsertRowid;
}

/**
 * Completes an execution.
 *
 * @param {number} id Execution ID
 * @param {string} status Final status
 */
function completeExecution(id, status = 'completed') {

    db.prepare(`
        UPDATE test_executions
        SET completed_at = ?, status = ?
        WHERE id = ?
    `).run(
        new Date().toISOString(),
        status,
        id
    );

}

module.exports = {
    createExecution,
    completeExecution
};