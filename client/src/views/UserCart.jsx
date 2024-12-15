import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar.jsx'; 
import logo from '../Images/Logo.png';
import background from '../Images/profileBG2.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowCart = () => {
  const { userId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`https://lunu-mirisa.vercel.app/ShowCart/${userId}`);
        const groupedItems = groupCartItems(response.data.cartItems);
        setCartItems(groupedItems);
        
        // Ensure totalPrice is a number
        setTotalPrice(calculateTotalPrice(groupedItems));
      } catch (err) {
        setError('Failed to fetch cart items');
        console.error('Error fetching cart items:', err);
        toast.error('Error fetching cart items', { autoClose: 3000 });
      }
    };

    fetchCartItems();
  }, [userId]);

  const groupCartItems = (items) => {
    const groupedItems = {};

    items.forEach((item) => {
      const key = `${item.title}-${item.price}`;
      if (groupedItems[key]) {
        groupedItems[key].quantity += item.quantity; 
      } else {
        groupedItems[key] = {
          ...item,
          quantity: item.quantity || 1 
        };
      }
    });

    return Object.values(groupedItems);
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      return total + (Number(item.price) * item.quantity);
    }, 0);
  };

  const handleDelete = async (itemTitle) => { 
    try {
      await axios.delete(`https://lunu-mirisa.vercel.app/RemoveFromCart/${itemTitle}/${userId}`); 
    
      const updatedCartItems = cartItems.filter(item => item.title !== itemTitle);
      setCartItems(updatedCartItems);

      setTotalPrice(calculateTotalPrice(updatedCartItems));
      toast.success('Items removed from cart', { autoClose: 3000 });
    } catch (err) {
      console.error('Error deleting cart items:', err);
      setError('Failed to delete items from cart');
      toast.error('Error deleting items from cart', { autoClose: 3000 });
    }
  };

  const handleUpdate = async (itemId, newQuantity) => {
    try {
      await axios.put(`https://lunu-mirisa.vercel.app/UpdateCartItem/${itemId}`, { quantity: newQuantity });

      const updatedCartItems = cartItems.map(item => {
        if (item._id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCartItems(updatedCartItems);
      setTotalPrice(calculateTotalPrice(updatedCartItems));
      toast.success('Cart item updated successfully', { autoClose: 3000 });
    } catch (err) {
      console.error('Error updating cart item:', err);
      toast.error('Error updating cart item', { autoClose: 3000 });
    }
  };

  return (
    <div>
      <NavigationBar logo={logo} />
      <div className="flex items-center justify-center min-h-screen"
           style={{ 
             backgroundImage: `url(${background})`, 
             backgroundSize: 'cover', 
             backgroundPosition: 'center' 
           }}>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl mt-6 mb-6">
          <h2 className="text-5xl text-center font-semibold font-serif-black mb-4 text-white pb-4 focus-">Your Cart</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map(item => (
                <div key={item._id} className="bg-gray-100 hover:bg-gray-300 border p-4 rounded-lg shadow-md flex flex-col justify-between transition-all duration-300 ease-out transform hover:scale-105">
                  <div>
                    <img 
                      src={`https://lunu-mirisa.vercel.app/Images/` + item.image} 
                      alt={item.image} 
                      className="w-full h-48 bg-cover mx-auto bg-center mt-5"
                    />
                    <h3 className="text-xl font-semibold">Rs.{item.price.toFixed(2)}</h3>
                    <p className="text-gray-600">Category: {item.category}</p>
                    <p className="text-gray-600">Item Name: {item.title}</p>
                    <p className="text-gray-600">Quantity: 
                      <input 
                        type="number" 
                        value={item.quantity} 
                        min="1" 
                        onChange={(e) => handleUpdate(item._id, parseInt(e.target.value))} 
                        className="ml-2 w-16 text-center border border-gray-300"
                      />
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button 
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDelete(item.title)} 
                    >
                      Delete
                    </button>
                    <button 
                      className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleUpdate(item._id, item.quantity)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className="mt-4">
            <p className="text-white pt-4 text-3xl font-serif-black">Total:</p>
            <p className="text-white pt-4 text-4xl font-serif-black flex justify-end mt-4">Rs.{totalPrice.toFixed(2)}</p>
            <div className="flex justify-end mt-4">
              <Link 
                to={`/CartForm/${userId}/${totalPrice}/${encodeURIComponent(
                  JSON.stringify(
                    cartItems.map(item => ({
                      title: item.title,
                      quantity: item.quantity
                    }))
                  )
                )}`}
              >
                <button
                  id="checkout_btn"
                  className="bg-black hover:bg-gray-700 text-white font-bold py-2 mt-6 px-4 rounded"
                  disabled={cartItems.length === 0} 
                >
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ShowCart;
