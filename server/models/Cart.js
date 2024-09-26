const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 } 
});

module.exports = mongoose.model('Cart', CartSchema);
