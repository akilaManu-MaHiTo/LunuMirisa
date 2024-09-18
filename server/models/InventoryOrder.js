const mongoose = require('mongoose');

const InventoryOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  image: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true, // Quantity is required
  },
  maxQuantity: {
    type: Number,
    required: true, // Max Quantity is required
  },
  category: {
    type: String,
    required: true, // Category is required
    enum: ['Vegetables', 'Fruits', 'Spices', 'Meat', 'Fisheries'], // Valid categories
  },
  orderQuantity: {
    type: Number,
    required: true, // Order quantity (derived from maxQuantity - quantity)
  },
});


const InventoryOrderModel = mongoose.model('InventoryOrder', InventoryOrderSchema);
module.exports = InventoryOrderModel;
