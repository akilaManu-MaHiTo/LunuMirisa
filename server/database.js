const mongoose = require('mongoose');

// Use environment variable for database URL (don't hardcode credentials)
const URL = process.env.MONGO_URI || 'mongodb+srv://akilamanujith_db_user:akilamanu@cluster0.chwffhr.mongodb.net/?appName=Cluster0';

// Export connection function
module.exports = () => {
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
