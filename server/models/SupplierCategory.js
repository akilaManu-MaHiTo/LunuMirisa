const mongoose = require('mongoose');

const SupplierCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('suppliercategories', SupplierCategorySchema);

