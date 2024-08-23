const nodemailer = require('nodemailer');
require('dotenv').config();

// Log environment variables
console.log('Host:', process.env.HOST);
console.log('Port:', process.env.EMAIL_PORT);
console.log('Secure:', process.env.SECURE);
console.log('User:', process.env.USER);

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.SECURE === 'true', // true for port 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

// Setup email data
let mailOptions = {
  from: `"Test Sender" <${process.env.USER}>`, // sender address
  to: 'liyanagesupun10@gmail.com', // replace with actual recipient email
  subject: 'Test Email', // Subject line
  text: 'This is a test email sent using Nodemailer.', // plain text body
  html: '<b>This is a test email sent using Nodemailer.</b>' // html body
};

// Send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error:', error);
  }
  console.log('Message sent:', info.messageId);
});
