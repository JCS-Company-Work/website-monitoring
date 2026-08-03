/**
 * Database queries for managing active and historical test failures.
 *
 * A failure remains open until the associated test passes.
 * Repeated failures update the existing record instead of creating duplicates,
 * allowing incidents to track first seen, last seen and occurrence count.
 */

// Pull in database connection
const db = require('../database');

/**
 * Creates a new failure record for a test.
 *
 * Called when no unresolved failure currently exists.
 *
 * @param {Object} failure
 */
function createFailure(failure) {

    console.log('createFailure input:', failure);

    const result = db.prepare(`
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

    console.log('Created failure ID:', result.lastInsertRowid);

}

/**
 * Finds the current unresolved failure for a test.
 *
 * Used to determine whether a new incident should be created
 * or an existing incident should be updated.
 *
 * @param {number} testId
 * @returns {Object|undefined}
 */
function findOpenFailure(testId) {

    return db.prepare(`
        SELECT
            failures.*
        FROM failures
        INNER JOIN test_results
            ON failures.test_result_id = test_results.id
        WHERE test_results.test_id = ?
        AND failures.resolved_at IS NULL
        LIMIT 1
    `).get(testId);

}

/**
 * Marks an active failure as resolved.
 *
 * Called when a previously failing test passes.
 *
 * @param {number} id
 */
function resolveFailure(id) {

    db.prepare(`
        UPDATE failures
        SET resolved_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(id);

}

/**
 * Updates an active failure after another failed execution.
 *
 * Increments the occurrence count and updates the last seen timestamp.
 *
 * @param {number} id
 */
function updateFailure(id) {

    db.prepare(`
        UPDATE failures
        SET
            occurrences = occurrences + 1,
            last_seen = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(id);

}

module.exports = {
    createFailure,
    findOpenFailure,
    resolveFailure,
    updateFailure
};