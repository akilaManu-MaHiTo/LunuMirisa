// models/CartForm.js
const mongoose = require('mongoose');

// Define the Cart schema
const cartFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // You can add an email validator if needed
    validate: {
      validator: (v) => /^\S+@\S+\.\S+$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit-card', 'paypal', 'bank-transfer'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Cart model
const CartForm = mongoose.model('CartForm', cartFormSchema);
module.exports = CartForm;
