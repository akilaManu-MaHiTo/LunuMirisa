const nodemailer = require("nodemailer");

// Replace these values with your actual email configuration
const host = "smtp.gmail.com";
const port = 587;
const secure = false; // true for 465, false for other ports
const user = "lunumirisasrilanka@gmail.com";
const pass = "ujci ltpk tfxe qiaf";

module.exports = async (email, subject, text, html) => {
    try {
        // Log configuration for debugging
        console.log('Host:', host);
        console.log('Port:', port);
        console.log('Secure:', secure);
        console.log('User:', user);

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
