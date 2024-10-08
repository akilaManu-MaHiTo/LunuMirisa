import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import background from '../Images/profileBG2.jpg';

const CartDetailsForm = () => {
  const [name, setName] = useState('');
  const { userId } = useParams();
  const {totalPrice} = useParams()
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cartItems, setCartItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const currentURL = location.pathname;
    const jsonString = decodeURIComponent(currentURL.split('/').pop());

    try {
      const parsedData = JSON.parse(jsonString);
      setCartItems(parsedData);
    } catch (error) {
      console.error('Error parsing JSON from URL:', error);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      address,
      email,
      paymentMethod,
      cartItems,
      totalPrice,
      userId:userId
    };

    try {
      const response = await axios.post('http://localhost:3001/addCartInfo', formData);
      console.log('Response:', response.data);
      setSubmitted(true);

      
      setTimeout(() => {
        navigate('/'); 
      }, 4000);
      
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ 
        backgroundImage: `url(${background})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}>
      <div className="bg-gray-300 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-4 font-serif-black ">Checkout Form</h2>

        {submitted ? (
          <p className="text-green-500 font-semibold text-2xl">Order placed successfully! </p>
        ) : (
          <form className="pt-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-black hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CartDetailsForm;
