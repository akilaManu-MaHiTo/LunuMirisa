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
  cartItems: [
    {
      title: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalPrice:{
    type: String
  },
  userId:{
    type:String
  }
});

// Export the Cart model
const CartForm = mongoose.model('CartForm', cartFormSchema);
module.exports = CartForm;
