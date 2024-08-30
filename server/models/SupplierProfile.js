const mongoose = require('mongoose');

const SupplierProfilesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model('supplierprofiles', SupplierProfilesSchema);
