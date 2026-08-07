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

            },

            requireTLS: true,

            logger: true,
            debug: true,

            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000

        });

    }

    /**
     * Sends an email notification.
     *
     * @param {Object} options Email details
     */
    async send(options) {

    console.log('Email send starting');

    const timeout = new Promise((_, reject) => {

        setTimeout(() => {

            reject(
                new Error('SMTP timeout after 10 seconds')
            );

        }, 10000);

    });


    await Promise.race([
        this.transporter.verify(),
        timeout
    ]);


    console.log('SMTP verified');


    return this.transporter.sendMail({

        from: process.env.SMTP_FROM,

        to: process.env.SMTP_TO,

        subject: options.subject,

        text: options.message

    });

}

}

module.exports = EmailService;