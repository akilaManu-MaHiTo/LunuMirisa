import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EmployeeNavigation from './Components/AdminNavigationBar'

const ShowMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState({});
  
  // Use a single useParams call
  const { id, userId, tableNum, date, ongoing } = useParams();

  useEffect(() => {
    axios.get("http://localhost:3001/ShowMenuList")
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the menu items!", error);
        setError('There was an error fetching the menu items!');
      });
  }, []);

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = selectedQuantities[item._id] || 1;
    const totalPrice = item.price * quantity;

    console.log("Adding to cart:", id, item._id, item.category, item.type, totalPrice, quantity, userId, tableNum, date, ongoing);
    axios.post("http://localhost:3001/InOrderCreate", {
      orderId: id,  // Include the order ID
      itemId: item._id,
      category: item.category,
      type: item.type,
      price: item.price,
      quantity,
      totalPrice,  // Include the total price
      userId,
      tableNum,
      date,
      ongoing
    })
    .then(response => {
      console.log("Added to cart:", response.data);
    })
    .catch(error => {
      console.error("There was an error adding the item to the cart!", error);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">

      <EmployeeNavigation/>
      <div className="p-8 lg shadow-md w-full h-full max-w-7xl">
        <h2 className="text-white text-3xl font-bold mb-4">Menu Items</h2>
        {error && <p className="text-red-500">{error}</p>}
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
                <img src={item.image} alt={item.type} className="w-32 h-32 rounded-md mb-4" />
                <div className="text-white font-bold text-lg mb-2">{item.type}</div>
                <div className="text-white text-sm mb-4">{item.category}</div>
                
                <QuantitySelector 
                  initialQuantity={1}
                  price={item.price}
                  onQuantityChange={(quantity) => handleQuantityChange(item._id, quantity)} 
                />

                <button
                  onClick={() => handleAddToCart(item)}  // Use the item directly
                  className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                >
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white-500">No menu items available.</p>
        )}
      </div>
    </div>
  );
};

const QuantitySelector = ({ initialQuantity, price, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [totalPrice, setTotalPrice] = useState(price);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * price);
    onQuantityChange(newQuantity); // Notify parent of quantity change
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * price);
    onQuantityChange(newQuantity); // Notify parent of quantity change
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleDecrement} 
          className="bg-gray-600 text-white px-2 py-1 rounded"
        >
          -
        </button>
        <span className="text-white">{quantity}</span>
        <button 
          onClick={handleIncrement} 
          className="bg-gray-600 text-white px-2 py-1 rounded"
        >
          +
        </button>
      </div>
      <div className="text-white font-bold text-lg mt-2">Total: Rs. {totalPrice}/-</div>
    </div>
  );
};

export default ShowMenuList;
