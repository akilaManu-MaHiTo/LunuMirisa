import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import EmployeeNavigation from './Components/AdminNavigationBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All Meals');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const { id, userId, tableNum, date, ongoing } = useParams();

  useEffect(() => {
    axios.get("http://localhost:3001/ShowMenuList")
      .then(response => {
        setMenuItems(response.data);
        toast.success("Menu items loaded successfully!");
      })
      .catch(error => {
        console.error("There was an error fetching the menu items!", error);
        setError('There was an error fetching the menu items!');
        toast.error('There was an error fetching the menu items!');
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

    axios.post("http://localhost:3001/InOrderCreate", {
      orderId: id,
      itemId: item._id,
      category: item.category,
      title: item.title,
      price: item.price,
      quantity,
      totalPrice,
      userId,
      tableNum,
      date,
      ongoing,
      image: item.image
    })
    .then(response => {
      console.log("Added to cart:", response.data);
      toast.success("Item added to cart!");
    })
    .catch(error => {
      console.error("There was an error adding the item to the cart!", error);
      toast.error("There was an error adding the item to the cart!");
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Filter menu items based on category and search query
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All Meals' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <EmployeeNavigation />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="p-6 md:p-8 lg:p-10 shadow-md w-full max-w-7xl bg-gray-800 rounded-lg">

          {/* Search Input Field */}
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              className="p-2 rounded-lg bg-gray-700 text-white"
            />
          </div>

          {/* Category Buttons */}
          <div className="flex justify-center my-6 md:mx-20 lg:mx-32 flex-wrap">
            {['All Meals', 'Appetizers', 'Main Course', 'Specials', 'Beverages'].map((category, idx) => (
              <button 
                key={idx}
                onClick={() => handleCategoryClick(category)} 
                className={`p-3 w-[8rem] mx-2 md:w-[10rem] rounded-full mb-4 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  selectedCategory === category ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <h2 className="text-white text-3xl font-bold mb-4 text-center">Menu Items</h2>
          <Link to={`/ShowMyOrders/${userId}`}>
            <button className='bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition duration-200'>
              Show My Orders
            </button>
          </Link>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div key={item._id} className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-105">
                  <img 
                    src={`http://localhost:3001/Images/${item.image}`} 
                    alt={item.title} 
                    className="w-32 h-32 rounded-md mb-4 object-cover"
                  />
                  <div className="text-white font-bold text-lg mb-2">{item.title}</div>
                  <div className="text-gray-400 text-sm mb-4">{item.category}</div>
                  
                  <QuantitySelector 
                    initialQuantity={1}
                    price={item.price}
                    onQuantityChange={(quantity) => handleQuantityChange(item._id, quantity)} 
                  />

                  <button
                    onClick={() => handleAddToCart(item)} 
                    className="bg-green-600 text-white px-4 py-2 rounded-md transition-transform duration-300 hover:bg-green-700"
                  >
                    Add to Order
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No menu items available.</p>
          )}
        </div>
        <ToastContainer />
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
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setTotalPrice(newQuantity * price);
      onQuantityChange(newQuantity);
    } else {
      toast.error("Can't reduce quantity below 1!"); // Show toast if quantity is already 1
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleDecrement} 
          className="bg-gray-600 text-white px-3 py-1 rounded-md transition-colors duration-200 hover:bg-gray-500"
        >
          -
        </button>
        <span className="text-white text-lg">{quantity}</span>
        <button 
          onClick={handleIncrement} 
          className="bg-gray-600 text-white px-3 py-1 rounded-md transition-colors duration-200 hover:bg-gray-500"
        >
          +
        </button>
      </div>
      <div className="text-white font-bold text-lg mt-2">Total: Rs. {totalPrice}/-</div>
    </div>
  );
};

export default ShowMenuList;
