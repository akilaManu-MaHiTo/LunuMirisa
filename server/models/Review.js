const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Ensure rating is between 1 and 5
    },
    review: {
        type: String,
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    FirstName: {
        type: String,
        trim: true,
        required: true,
    },
    LastName: {
        type: String,
        trim: true,
        required: true,
    },
    profileImage: {
        type: String,
        
        
    },
});

// Create and export the model
const Rating = mongoose.model('ratings', ratingSchema);
module.exports = Rating;
