const mongoose = require('mongoose');

// Fail-fast if MONGO_URI is not configured - prevents accidental fallback to hardcoded creds (OWASP A01/A02)
const URL = process.env.MONGO_URI;
if (!URL) {
    console.error('FATAL: MONGO_URI is not set. Set it in server/.env (see .env.example)');
}

// Export connection function
module.exports = () => {
    if (!URL) {
        return Promise.reject(new Error('MONGO_URI not configured - aborting DB connection'));
    }
    return mongoose.connect(URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        throw err; // Rethrow to be caught in the main server file
    });
};
