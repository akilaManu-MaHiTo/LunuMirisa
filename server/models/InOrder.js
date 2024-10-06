const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  orderId: String,
  itemId: String,
  category: String,
  title: String,
  price: Number,
  quantity: Number,
  totalPrice: Number,
  userId: String,
  tableNum: String,  // Include tableNum field
  date: String,      // Include date field
  ongoing: String,   // Include status field
  image: String
});

const OrderItemModel = mongoose.model('orderItems', OrderItemSchema);
module.exports = OrderItemModel;
