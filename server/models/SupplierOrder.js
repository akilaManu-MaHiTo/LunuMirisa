const mongoose = require('mongoose');

const SupplierOrderSchema = new mongoose.Schema({

  name: { type: String, required: true },
  orderQuantity: { type: Number, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  deliveryDate: { type: Date, required: true },
  specialNote: { type: String },
  supplierId: { type: String, required: true },
  supplierName: { type: String, required: true }, 
});

module.exports = mongoose.model('suppliers', SupplierOrderSchema);
