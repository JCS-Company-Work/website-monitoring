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

// Pull in test queries to find tests by slug
const { findBySlug } = require('../db/queries/tests');

// Pull in failure queries to save failures to the database
const {
    createFailure,
    findOpenFailure,
    updateFailure,
    resolveFailure
} = require('../db/queries/failures');

// Pull in the failure notification service to send email alerts
const FailureNotification = require('../services/notifications/FailureNotification');

// Pull in path module to handle file paths
const path = require('path');

class TestReporter {

  constructor() {
    this.results = [];
    this.executionId = null;
    this.notification = new FailureNotification();
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
  async onTestEnd(test, result) {

    const testRecord = findBySlug(
        process.env.MONITORING_TEST_SLUG
    );
    
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

    // Check for an existing unresolved failure for this test
    const existingFailure = findOpenFailure(testRecord.id);

    // If the test failed, create a failure record
    if (result.status === 'failed') {

      // If failure instance exists, update it, do not create a new one
      const existingFailure = findOpenFailure(testRecord.id);

      if (existingFailure) {

        updateFailure(existingFailure.id);

      } else {

        // Create a new failure record
        createFailure({
            testResultId: resultId,
            errorMessage: output.error,
            stackTrace: stripAnsi(result.error?.stack)
        });

        // Send a notification for the new failure
        try{

          await this.notification.send({

              test: testRecord,

              error: output.error

          });

        } catch (error) {

          // Log the error if sending the notification fails
          console.error(
              'Failed to send failure notification:',
              error
          );
        }
      }
    }

    // Handle passing tests
    if (result.status === 'passed') {

        if (existingFailure) {

            resolveFailure(existingFailure.id);

        }

    }

  }

  /**
   * Runs when the full Playwright test suite completes.
   */
  onEnd() {

    if (this.executionId !== null) {
        completeExecution(this.executionId);
    }

  }

}

module.exports = TestReporter;