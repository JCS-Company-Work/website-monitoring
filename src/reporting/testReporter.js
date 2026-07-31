/**
 * Custom Playwright reporter.
 * Converts Playwright test results into our standard result format.
 */

// Pull in ANSI stripping utility to clean up error messages
const { stripAnsi } = require('../utils/formatters');

// Pull in results queries to save results to the database
const { saveResult } = require('../db/queries/results');

// Pull in execution queries to create and complete executions
const { createExecution, completeExecution } = require('../db/queries/executions');

// Pull in test queries to find tests by name
const { findByName } = require('../db/queries/tests');

// Pull in failure queries to save failures to the database
const { createFailure } = require('../db/queries/failures');

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
      error: stripAnsi(result.error?.message ?? null)
    };

    this.results.push(output);

    // Get the ID of the newly created test result
    const resultId = saveResult(output);

    // If the test failed, create a failure record
    if (result.status === 'failed') {

      createFailure({
          testResultId: resultId,
          errorMessage: output.error,
          stackTrace: stripAnsi(result.error?.stack ?? null)
      });

    }
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