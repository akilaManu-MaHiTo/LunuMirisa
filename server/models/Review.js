const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
        set: v => v.toLowerCase(), // Convert userId to lowercase before saving
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 
    },
    reviewTitle: { 
        type: String,
        trim: true,
        required: true, 
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
        trim: true,
        default: 'default-profile-image-url.jpg' // Set a default image URL if none is provided
    },
});

// Create and export the model
const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
