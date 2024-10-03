import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Loader from './Components/Loader.jsx';
import foodImage from '../Images/Biriyani.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faMartiniGlass, faPizzaSlice, faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowMenuLists = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const [topThreeItems, setTopThreeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fade, setFade] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
    fetchTopThreeItems();

    // Restore scroll position
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
      localStorage.removeItem('scrollPosition');  // Clear it after restoring
    }
  }, []);

  const fetchMenuItems = () => {
    axios.get("http://localhost:3001/ShowMenuList")
      .then(response => {
        setMenuItems(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('There was an error fetching the menu items!');
        setLoading(false);
        toast.error('Error fetching menu items!');
      });
  };

  const fetchTopThreeItems = () => {
    axios.get("http://localhost:3001/topThreeItemIds")
      .then(response => setTopThreeItems(response.data))
      .catch(() => toast.error('Error fetching top three items!'));
  };

  const handleAddToCart = (item) => {
    // Save the current scroll position
    const scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', scrollPosition);

    // Make a POST request to add the item to the cart
    axios.post("http://localhost:3001/Addtocarts", {
      userId,
      itemId: item._id,
      category: item.category,
      title: item.title,
      price: item.price,
    })
    .then(() => {
      // Show success message with toast
      toast.success(`${item.title} added to cart successfully!`);
  
      // Reload the page to reflect changes
      window.location.reload();
    })
    .catch(() => {
      // Show error message if adding to cart fails
      toast.error(`Error adding ${item.title} to cart. Please try again!`);
    });
  };
  
  const handleCategoryClick = (category) => {
    setFade(true);
    setTimeout(() => {
      setSelectedCategory(category);
      if (category === 'All') {
        setFilteredItems(menuItems);
        fetchTopThreeItems();
      } else {
        setFilteredItems(menuItems.filter(item => item.category === category));
        setTopThreeItems([]);
      }
      setFade(false);
    }, 300);
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-custom-black">
      <NavigationBar logo={logo} />

      {/* Category Buttons */}
      <div className="flex justify-center my-10 md:mx-20 lg:mx-32 flex-wrap bg-custom-black">
        {['All', 'Appetizers', 'Main Course', 'Specials', 'Beverages'].map((category, idx) => (
          <button 
            key={idx}
            onClick={() => handleCategoryClick(category)} 
            className={`category-button p-3 w-[8rem] mx-5 md:w-[10rem] rounded-full mb-4 ${
              selectedCategory === category ? 'bg-white text-black' : 'bg-custom-gray text-white'
            } transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            {category} <FontAwesomeIcon icon={getIconForCategory(category)} />
          </button>
        ))}
      </div>

      {/* Top 3 Hot Items */}
      {selectedCategory === 'All' && (
        <div className="bg-custom-black flex flex-col items-center">
          <h2 className="text-white text-2xl font-bold mb-10">Today's Hot Items</h2>
          {topThreeItems.length > 0 ? (
            <div className="flex justify-start gap-4">
              {topThreeItems.map(item => (
                <ItemCard key={item.itemId} item={item} onAddToCart={() => handleAddToCart(item)} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No top items in cart.</p>
          )}
        </div>
      )}

      {/* Menu Items */}
      <div className="flex items-center justify-center min-h-screen bg-custom-black">
        <div className="bg-custom-black shadow-md w-full h-full max-w-4xl">
          <h2 className="text-white text-2xl font-bold mt-6 mb-10">{selectedCategory}</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className={`transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                  <ItemCard key={item._id} item={item} onAddToCart={() => handleAddToCart(item)} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No menu items available.</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

// Component to display each item card
const ItemCard = ({ item, onAddToCart }) => (
  <div className="bg-custom-gray p-6 rounded shadow-md w-full max-w-xs transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
    {/* <img src={foodImage} alt={item.title} className="w-[14rem] h-auto rounded mx-auto mt-3 mb-6" /> */}
    <img 
      src={`http://localhost:3001/Images/` + item.image} 
      alt={item.name} 
      className="w-[14rem] h-auto rounded mx-auto mt-3 mb-6"
    />
    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
    <p className="text-white text-3xl mb-2">Rs.{item.price}/-</p>
    <div className="absolute top-3 right-5">
      <FontAwesomeIcon icon={getIconForCategory(item.category)} className="text-white" />
    </div>
    <div className='text-white text-2xl'>{item.description}</div>
    <button onClick={onAddToCart} className="bg-white text-black py-2 px-4 rounded hover:bg-black hover:text-white transition duration-300 hover:scale-105">
      Add to cart
    </button>
  </div>
);

// Helper function to get category icons
const getIconForCategory = (category) => {
  switch (category) {
    case 'Appetizers': return faBreadSlice;
    case 'Main Course': return faPizzaSlice;
    case 'Specials': return faPepperHot;
    case 'Beverages': return faMartiniGlass;
    default: return null;
  }
};

export default ShowMenuLists;
