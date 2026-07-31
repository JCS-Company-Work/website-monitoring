// Pull in database connection
const db = require('../database');

/**
 * Creates a new failure record.
 *
 * @param {Object} failure Failure details
 */
function createFailure(failure) {

    db.prepare(`
        INSERT INTO failures (
            test_result_id,
            error_message,
            stack_trace
        )
        VALUES (?, ?, ?)
    `).run(
        failure.testResultId,
        failure.errorMessage,
        failure.stackTrace ?? null
    );

}

module.exports = {
    createFailure
};