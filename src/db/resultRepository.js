// Pull in the database instance
const db = require('./database');

// Create the test_runs table if it doesn't exist
const insertResult = db.prepare(`
  INSERT INTO test_runs (
    test_name,
    file,
    status,
    duration,
    error
  )
  VALUES (?, ?, ?, ?, ?)
`);


/**
 * Saves a completed test result.
 *
 * @param {Object} result Standardised test result
 */
function saveResult(result) {

  insertResult.run(
    result.testName,
    result.file,
    result.status,
    result.duration,
    result.error
  );

}

// Export the saveResult function
module.exports = {
  saveResult
};