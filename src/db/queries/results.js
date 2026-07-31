// Pull in the database instance
const db = require('../database');

/**
 * Saves a completed test result.
 *
 * @param {Object} result Standardised test result
 * @returns {number} ID of the newly created test result
 */
function saveResult(result) {

  const output = db.prepare(`
      INSERT INTO test_results (
          execution_id,
          test_id,
          status,
          duration,
          error,
          started_at,
          completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
      result.executionId,
      result.testId,
      result.status,
      result.duration,
      result.error,
      result.startedAt.toISOString(),
      new Date().toISOString()
  );

  console.log('Saved test result ID:', output.lastInsertRowid);

  return output.lastInsertRowid;

}

module.exports = {
  saveResult
};