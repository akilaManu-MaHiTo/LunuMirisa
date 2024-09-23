import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Loader from './Components/Loader.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faMartiniGlass, faPizzaSlice, faPepperHot } from '@fortawesome/free-solid-svg-icons';

const ShowMenuLists = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const [topThreeItems, setTopThreeItems] = useState([]); // For top 3 cart items
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Appetizers');

  useEffect(() => {
    // Fetch menu items
    axios.get("http://localhost:3001/ShowMenuList")
      .then(response => {
        setMenuItems(response.data);
        setFilteredItems(response.data); // Initially show all items
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the menu items!", error);
        setError('There was an error fetching the menu items!');
        setLoading(false);
      });

    // Fetch top three items in cart
    axios.get("http://localhost:3001/topThreeItemIds")
      .then(response => {
        setTopThreeItems(response.data); // Store the top items
      })
      .catch(error => {
        console.error("There was an error fetching top three items!", error);
      });
  }, []);

  const handleAddToCart = (item) => {
    console.log("Adding to cart:", userId, item._id, item.category, item.type, item.price);
    axios.post("http://localhost:3001/Addtocarts", {
      userId,
      itemId: item._id,
      category: item.category,
      type: item.type,
      price: item.price
    })
    .then(response => {
      console.log("Added to cart:", response.data);
    })
    .catch(error => {
      console.error("There was an error adding the item to the cart!", error);
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredItems(menuItems);
      // Fetch top three items in cart when "All" is selected
      axios.get("http://localhost:3001/topThreeItemIds")
        .then(response => {
          setTopThreeItems(response.data); // Restore the top items
        })
        .catch(error => {
          console.error("There was an error fetching top three items!", error);
        });
    } else {
      const filtered = menuItems.filter(item => item.category === category);
      setFilteredItems(filtered);
      setTopThreeItems([]); // Clear top 3 items when filtering by category
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='bg-custom-black'>
      <NavigationBar logo={logo} />

      <div className="flex justify-center my-10 md:mx-20 lg:mx-32 flex-wrap bg-custom-black">
        <button 
          onClick={() => handleCategoryClick('All')} 
          className={`p-3 w-[8rem] mx-10 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'All' ? 'bg-white text-black' : 'bg-custom-gray text-white'}`}
        >
          All <FontAwesomeIcon icon={faBreadSlice} />
        </button>
        <button 
          onClick={() => handleCategoryClick('Appetizers')} 
          className={`p-3 w-[8rem] mx-10 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Appetizers' ? 'bg-white text-black' : 'bg-custom-gray text-white'}`}
        >
          Appetizers <FontAwesomeIcon icon={faBreadSlice} />
        </button>
        <button 
          onClick={() => handleCategoryClick('Main Course')} 
          className={`p-3 w-[8rem] mx-10 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Main Course' ? 'bg-white text-black' : 'bg-custom-gray text-white'}`}
        >
          Main Course <FontAwesomeIcon icon={faPizzaSlice} />
        </button>
        <button 
          onClick={() => handleCategoryClick('Specials')} 
          className={`p-3 w-[8rem] mx-10 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Specials' ? 'bg-white text-black' : 'bg-custom-gray text-white'}`}
        >
          Specials <FontAwesomeIcon icon={faPepperHot} />
        </button>
        <button 
          onClick={() => handleCategoryClick('Beverages')} 
          className={`p-3 w-[8rem] mx-10 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Beverages' ? 'bg-white text-black' : 'bg-custom-gray text-white'}`}
        >
          Beverages <FontAwesomeIcon icon={faMartiniGlass} />
        </button>
      </div>

      {/* Display top three items in cart if "All" is selected */}
      {selectedCategory === 'All' && (
        <div className="my-10 mx-10 md:mx-20 lg:mx-32 bg-custom-black">
          <h2 className="text-white text-2xl font-bold mb-4">Top 3 Cart Items</h2>
          {topThreeItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topThreeItems.map((item) => (
                <div key={item.itemId} className="bg-custom-gray p-6 rounded shadow-md w-[22rem] max-w-md">
                  <h3 className="text-white text-lg font-bold mb-2">{item.type}</h3>
                  <p className="text-white">Price: Rs.{item.maxPrice}/-</p>
                  <p className="text-white">{item.category}/-</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No top items in cart.</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen bg-custom-black">
        <div className="bg-custom-black p-8 shadow-md w-full h-full max-w-4xl">
          <h2 className="text-white text-2xl font-bold mb-4">{selectedCategory}</h2>
          {error && <p className="text-red-500">{error}</p>}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-custom-black p-6 rounded shadow-md">
                  <div className="bg-custom-gray h-auto p-6 rounded shadow-md w-[22rem] max-w-md mb-4 md:mb-0 flex flex-col items-center">
                    <div className="text-white font-bold text-lg mb-2">{item.type}</div> {/* Item type displayed */}
                    <div className="text-white font-bold text-lg mb-2">{item.title}</div> {/* Item type displayed */}
                    <div className="text-white font-thin text-md mb-4">{item.category}</div> {/* Item category displayed */}
                    <div className="text-white font-thin text-2xl mb-6">Rs.{item.price}/-</div> {/* Item price displayed */}

                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No menu items available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowMenuLists;
