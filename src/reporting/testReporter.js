/**
 * Custom Playwright reporter.
 * Converts Playwright test results into our standard result format.
 */

// Pull in results queries to save results to the database
const { saveResult } = require('../db/queries/results');

// Pull in execution queries to create and complete executions
const { createExecution, completeExecution } = require('../db/queries/executions');

// Pull in test queries to find tests by name
const { findByName } = require('../db/queries/tests');

class TestReporter {

  constructor() {
    this.results = [];
    this.executionId = null;
  }

  onBegin() {

    this.executionId = createExecution('manual');

    console.log(
        'Execution started:',
        this.executionId
    );

  }

  /**
   * Handles completed test results.
   *
   * @param {Object} test Playwright test details
   * @param {Object} result Playwright execution result
   */
  onTestEnd(test, result) {

    // Find the test record in the database by its name
    const testRecord = findByName(test.title);

    // If the test record doesn't exist, log an error and skip saving the result
    if (!testRecord) {

      console.error(
          `No database test found for: ${test.title}`
      );

      return;

  }

    const output = {
      executionId: this.executionId,
      testId: testRecord.id,
      status: result.status,
      duration: result.duration,
      startedAt: result.startTime,
      error: result.error?.message ?? null
    };

    this.results.push(output);

    // Save the result to the database
    saveResult(output);
  }

  /**
   * Runs when the full Playwright test suite completes.
   */
  onEnd() {
    console.log('CUSTOM REPORTER FIRED');
    console.log(this.results);
    if (this.executionId !== null) {
        completeExecution(this.executionId);
    }

  }

}

module.exports = TestReporter;