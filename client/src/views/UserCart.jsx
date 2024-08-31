import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ShowCart = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/ShowCart/${userId}`);
        setCartItems(response.data);
        console.log(userId)
      } catch (err) {
        setError('Failed to fetch cart items');
        console.error('Error fetching cart items:', err);
      }
    };

    fetchCartItems();
  }, [userId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map(item => (
              <li key={item._id} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Item ID: {item.itemId}</span> {/* Display itemId directly */}
                  <span className="text-gray-700">${item.price}</span>
                </div>
                <p className="text-gray-600">Category: {item.category} - Type: {item.type}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default ShowCart;
