/**
 * Formats and sends monitoring failure notifications.
 */

const EmailService = require('./EmailService');


class FailureNotification {


    constructor() {

        this.email = new EmailService();

    }

    /**
     * Send notification for a new failure.
     *
     * @param {Object} data Failure details
     */
    async send(data) {

        await this.email.send({

            subject:
                `[Website Monitoring] Test failed: ${data.test.name}`,

            message: `
                    Monitoring test failure

                    Test:
                    ${data.test.name}

                    Slug:
                    ${data.test.slug}

                    Error:

                    ${data.error}

                    Time:
                    ${new Date().toISOString()}
                                `.trim()

        });

    }

}

module.exports = FailureNotification;