const mongoose = require('mongoose');

const SupplierOrderSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  deliveryDate: { type: Date, required: true },
  specialNote: { type: String }
});

module.exports = mongoose.model('suppliers', SupplierOrderSchema);