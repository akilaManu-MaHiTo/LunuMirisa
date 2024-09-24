const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: String,
    itemId: String,
    category: String,
    title: String,
    price: String,
    cartDate: { type: Date, default: Date.now } // or use `Date.now` for current date by default
});

const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;
