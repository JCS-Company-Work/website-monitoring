/**
 * Email notification service.
 *
 * Handles sending monitoring notifications
 * via SMTP.
 */

const nodemailer = require('nodemailer');

class EmailService {

    constructor() {

        this.transporter = nodemailer.createTransport({

            host: process.env.SMTP_HOST,

            port: Number(
                process.env.SMTP_PORT
            ),

            secure: false,

            auth: {

                user: process.env.SMTP_USER,

                pass: process.env.SMTP_PASSWORD

            }

        });

    }

    /**
     * Sends an email notification.
     *
     * @param {Object} options Email details
     */
    async send(options) {

        return this.transporter.sendMail({

            from: process.env.SMTP_FROM,

            to: process.env.SMTP_TO,

            subject: options.subject,

            text: options.message

        });

    }

}

module.exports = EmailService;