const mongoose = require('mongoose');

const SupplierOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orderQuantity: { type: Number, required: true },
  category: { type: String, required: true },
  totalAmount: { type: Number, required: true }, // Renamed from 'amount' to 'totalAmount'
  deliveryDate: { type: Date, required: true },
  specialNote: { type: String },
  supplierId: { type: String, required: true },
  supplierName: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true }); // Optionally add timestamps

module.exports = mongoose.model('suppliers', SupplierOrderSchema); // Use singular form for the model name
