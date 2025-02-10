import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';

const emailRecipient = process.env.EMAIL_RECIPIENT;
const LOG_FILE = path.resolve("logs/execution.log");

async function sendEmail() {
    try {
        const logContent = await fs.readFile(LOG_FILE, 'utf-8');

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your-email@gmail.com",
                pass: "your-password"
            }
        });

        let mailOptions = {
            from: "your-email@gmail.com",
            to: emailRecipient,
            subject: "MongoDB Query Execution Report",
            text: logContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(`❌ Email failed: ${error.message}`);
            } else {
                console.log(`📩 Email sent: ${info.response}`);
            }
        });
    } catch (error) {
        console.error(`❌ Failed to read log file: ${error.message}`);
    }
}

sendEmail();