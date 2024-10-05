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
        const response = await axios.get(`http://localhost:3001/ShowCart/${userId}`);
        const groupedItems = groupCartItems(response.data.cartItems);
        setCartItems(groupedItems);
        setTotalPrice(response.data.totalPrice);
        //toast.success('Cart items fetched successfully!', { autoClose: 3000 });
      } catch (err) {
        setError('Failed to fetch cart items');
        console.error('Error fetching cart items:', err);
        toast.error('Error fetching cart items', { autoClose: 3000 });
      }
    };

    fetchCartItems();
  }, [userId]);

  // Group items by title and price and calculate quantity
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

  // Handle Delete
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/RemoveFromCart/${itemId}`);
      setCartItems(cartItems.filter(item => item._id !== itemId));

      const updatedTotalPrice = cartItems.reduce((total, item) => {
        return item._id === itemId ? total : total + parseFloat(item.price) * item.quantity;
      }, 0);
      setTotalPrice(updatedTotalPrice);

      toast.success('Item removed from cart', { autoClose: 3000 });
    } catch (err) {
      console.error('Error deleting cart item:', err);
      setError('Failed to delete item from cart');
      toast.error('Error deleting item from cart', { autoClose: 3000 });
    }
  };

  // Handle Update Quantity
  const handleUpdate = async (itemId, newQuantity) => {
    try {
      await axios.put(`http://localhost:3001/UpdateCartItem/${itemId}`, { quantity: newQuantity });

      const updatedCartItems = cartItems.map(item => {
        if (item._id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCartItems(updatedCartItems);

      const updatedTotalPrice = updatedCartItems.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0);
      setTotalPrice(updatedTotalPrice);

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
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mt-6 mb-6">
          <h2 className="text-5xl text-center font-semibold font-serif-black mb-4">Your Cart</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map(item => (
                <div key={item._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
                  <div>
                  <img 
                    src={`http://localhost:3001/Images/` + item.image} 
                    alt={item.image} 
                    className="w-[14rem] h-auto rounded mx-auto mt-3 mb-6"
                  />
                    <h3 className="text-xl font-semibold">Rs.{item.price}</h3>
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
                      onClick={() => handleDelete(item._id)}
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
            <p className="text-black pt-4 text-3xl font-serif-black">Total:</p>
            <p className="text-black pt-4 text-4xl font-serif-black flex justify-end mt-4">Rs.{totalPrice}</p>
            <div className="flex justify-end mt-4">
              <Link to={`/CartForm/${userId}/${totalPrice}`}>
                <button
                  id="checkout_btn"
                  className="bg-black hover:bg-gray-700 text-white font-bold py-2 mt-6 px-4 rounded"
                  disabled={cartItems.length === 0} // Disable button if cart is empty
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
