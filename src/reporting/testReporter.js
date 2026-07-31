/**
 * Custom Playwright reporter.
 * Converts Playwright test results into our standard result format.
 */

const { saveResult } = require('../db/queries/results');

class TestReporter {

  constructor() {
    this.results = [];
  }

  /**
   * Handles completed test results.
   *
   * @param {Object} test Playwright test details
   * @param {Object} result Playwright execution result
   */
  onTestEnd(test, result) {

    const output = {
      testName: test.titlePath().join(' > '),
      file: test.location.file,
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

  }

}

module.exports = TestReporter;