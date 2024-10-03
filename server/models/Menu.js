const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    title: {
        type: String,
        // Trim whitespace
    },
    image: {
        type: String,
        //required: true // Make image a required field
    },
    price: {
        type: Number,
        //required: true, // Make price a required field
        min: 0 // Ensure price is not negative
    },
    type: {
        type: String,
        //required: true // Make type a required field
    },
    category: {
        type: String,
        //required: true // Make category a required field
    },
    hotDeals: {
        type: String,
        default: "No" // Default to "Yes"
    },
    percentage: {
        type: Number,
        default: 0 // Default to "Yes"
    },
    description: {
        type: String,
        //default: 0 // Default to "Yes"
    }
});

const MenuModel = mongoose.model('menus', MenuSchema);
module.exports = MenuModel;
