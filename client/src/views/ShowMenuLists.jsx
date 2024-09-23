import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Loader from './Components/Loader.jsx';
import food from '../Images/Biriyani.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faMartiniGlass, faPizzaSlice, faPepperHot, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ShowMenuLists = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const [topThreeItems, setTopThreeItems] = useState([]);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fade, setFade] = useState(false); // State for fade transition

  useEffect(() => {
    // Fetch menu items
    axios.get("http://localhost:3001/ShowMenuList")
      .then(response => {
        setMenuItems(response.data);
        setFilteredItems(response.data);
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
        setTopThreeItems(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching top three items!", error);
      });
  }, []);

  const handleAddToCart = (item) => {
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
    setFade(true); // Start fade effect
    setTimeout(() => {
      setSelectedCategory(category);
      if (category === 'All') {
        setFilteredItems(menuItems);
        // Fetch top three items again if category is 'All'
        axios.get("http://localhost:3001/topThreeItemIds")
          .then(response => {
            setTopThreeItems(response.data);
          })
          .catch(error => {
            console.error("There was an error fetching top three items!", error);
          });
      } else {
        const filtered = menuItems.filter(item => item.category === category);
        setFilteredItems(filtered);
        setTopThreeItems([]);
      }
      setFade(false); // End fade effect
    }, 300); // Match the duration to the CSS transition time
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
    className={`category-button p-3 w-[8rem] mx-5 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'All' ? 'bg-white text-black' : 'bg-custom-gray text-white'} transition-all duration-300 ease-in-out transform hover:scale-105`}
  >
    All 
  </button>
  <button 
    onClick={() => handleCategoryClick('Appetizers')} 
    className={`category-button p-3 w-[8rem] mx-5 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Appetizers' ? 'bg-white text-black' : 'bg-custom-gray text-white'} transition-all duration-300 ease-in-out transform hover:scale-105`}
  >
    Appetizers <FontAwesomeIcon icon={faBreadSlice} />
  </button>
  <button 
    onClick={() => handleCategoryClick('Main Course')} 
    className={`category-button p-3 w-[8rem] mx-5 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Main Course' ? 'bg-white text-black' : 'bg-custom-gray text-white'} transition-all duration-300 ease-in-out transform hover:scale-105`}
  >
    Main Course <FontAwesomeIcon icon={faPizzaSlice} />
  </button>
  <button 
    onClick={() => handleCategoryClick('Specials')} 
    className={`category-button p-3 w-[8rem] mx-5 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Specials' ? 'bg-white text-black' : 'bg-custom-gray text-white'} transition-all duration-300 ease-in-out transform hover:scale-105`}
  >
    Specials <FontAwesomeIcon icon={faPepperHot} />
  </button>
  <button 
    onClick={() => handleCategoryClick('Beverages')} 
    className={`category-button p-3 w-[8rem] mx-5 md:w-[10rem] rounded-full mb-4 ${selectedCategory === 'Beverages' ? 'bg-white text-black' : 'bg-custom-gray text-white'} transition-all duration-300 ease-in-out transform hover:scale-105`}
  >
    Beverages <FontAwesomeIcon icon={faMartiniGlass} />
  </button>
</div>


      {selectedCategory === 'All' && (
        <div className="bg-custom-black flex flex-col items-center">
          <h2 className="text-white text-2xl font-bold mb-10">Today Hot Items</h2>
          {topThreeItems.length > 0 ? (
            <div className="flex justify-start gap-4">
              {topThreeItems.map((item) => (
                <div key={item.itemId} className="bg-custom-gray p-6 rounded shadow-md w-[19rem] max-w-md transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
                  <img src={food} alt="food" className='w-[14rem] h-auto rounded mx-auto mt-3 mb-6' />
                  <h3 className="text-white text-xl font-thin mb-2">{item.type}</h3>
                  <p className="text-white text-3xl">Rs.{item.maxPrice}/-</p>
                  <div className="absolute top-1 right-3">
                    {item.category === 'Appetizers' && <FontAwesomeIcon icon={faBreadSlice} className="text-white" />}
                    {item.category === 'Main Course' && <FontAwesomeIcon icon={faPizzaSlice} className="text-white" />}
                    {item.category === 'Specials' && <FontAwesomeIcon icon={faPepperHot} className="text-white" />}
                    {item.category === 'Beverages' && <FontAwesomeIcon icon={faMartiniGlass} className="text-white" />}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="bg-white text-black py-2 px-4 rounded hover:bg-black hover:text-white transition duration-300 hover:scale-105"
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No top items in cart.</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen bg-custom-black">
        <div className="bg-custom-black shadow-md w-full h-full max-w-4xl">
          <h2 className="text-white text-2xl font-bold mt-6 mb-10">{selectedCategory}</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className={`transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"> 
                {filteredItems.map((item) => (
                  <div key={item._id} className="bg-custom-black p-1 rounded shadow-md">
                    <div className="bg-custom-gray h-auto p-6 rounded shadow-md w-full mb-4 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
                      <img src={food} alt="food" className='w-[15rem] h-auto rounded mx-auto mt-6 mb-6' />
                      <div className="text-white font-thin text-lg mb-2">{item.title}</div>
                      <div className="absolute top-3 right-4">
                        {item.category === 'Appetizers' && <FontAwesomeIcon icon={faBreadSlice} className="text-white" />}
                        {item.category === 'Main Course' && <FontAwesomeIcon icon={faPizzaSlice} className="text-white" />}
                        {item.category === 'Specials' && <FontAwesomeIcon icon={faPepperHot} className="text-white" />}
                        {item.category === 'Beverages' && <FontAwesomeIcon icon={faMartiniGlass} className="text-white" />}
                      </div>
                      <p className="text-white text-3xl">Rs.{item.price}/-</p>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="bg-white text-black w-52 py-2 px-4 rounded hover:bg-black hover:text-white transition duration-300 hover:scale-105 mt-3"
                      >
                        <FontAwesomeIcon icon={faShoppingCart} /> Add to cart
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
    </div>
  );
};

export default ShowMenuLists;
