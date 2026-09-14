const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = async (email, subject, text, html) => {
    try {
        const host = process.env.HOST || "smtp.gmail.com";
        const port = Number(process.env.EMAIL_PORT) || 587;
        const secure = String(process.env.SECURE).toLowerCase() === 'true';
        const user = process.env.USER;
        const pass = process.env.PASS;

        if (!user || !pass) {
            throw new Error('Email credentials not configured (USER/PASS missing in .env)');
        }

        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure, // true for 465, false for other ports
            auth: {
                user: user,
                pass: pass
            }
        });

        const mailOptions = {
            from: user,
            to: email,
            subject: subject,
            text: text,
            html: html || text // Fallback to plain text if HTML is not provided
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};
