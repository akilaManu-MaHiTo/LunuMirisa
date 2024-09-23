import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Import Link
import navigation from './Components/NavigationBar'
import logo from '../Images/Logo.png'

const ShowCart = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/ShowCart/${userId}`);
        setCartItems(response.data.cartItems);
        setTotalPrice(response.data.totalPrice); // Set the total price from the response
      } catch (err) {
        setError('Failed to fetch cart items');
        console.error('Error fetching cart items:', err);
      }
    };

    fetchCartItems();
  }, [userId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-light bg-yellow-100">
      <navigation logo ={logo} />
      
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl text-center font-semibold font-serif-black mb-4 pb-4">Your Cart</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map(item => (
                <li key={item._id} className="mb-4">
                  <input type="hidden" value={item._id} />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Price: ${item.price}</span>
                  </div>
                  <p className="text-gray-600 pb-1">Category: {item.category} - Type: {item.type}</p>
                </li>
              ))}
            </ul>
            <div className="order-total-amount">
              <p>..........................................................................................................</p>
              <p className="text-black pt-4 text-2xl font-serif-black">Total:</p>
              <p className="text-black pt-4 text-1.5 xl text-right">${totalPrice}</p>
            </div>
            <div>
              {/* Link to CartDetailsForm */}
              <Link to="/cartdetailsform">
                <button
                  id="checkout_btn"
                  className="bg-gray-500 hover:bg-white text-white border-solid border-2 border-black  hover:text-black font-bold py-2 px-4 rounded pt-3"
                >
                  Checkout
                </button>
              </Link>
              <button className=" bg-white hover:bg-gray-500 text-black border-solid border-2 border-black  hover:text-white font-bold py-2 px-4 rounded pt-3 mx-3">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default ShowCart;
