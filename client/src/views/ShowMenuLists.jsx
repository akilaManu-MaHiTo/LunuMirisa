import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Loader from './Components/Loader.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice,faMartiniGlass,faPizzaSlice,faPepperHot } from '@fortawesome/free-solid-svg-icons';

const ShowMenuLists = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Appetizers');

  useEffect(() => {
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
    } else {
      const filtered = menuItems.filter(item => item.category === category);
      setFilteredItems(filtered);
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

      <div className="flex items-center justify-center min-h-screen bg-custom-black">
        <div className="bg-custom-black p-8 lg shadow-md w-full h-full max-w-4xl">
          <h2 className="text-white text-2xl font-bold mb-4">{selectedCategory}</h2>
          {error && <p className="text-red-500">{error}</p>}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-custom-black p-6 rounded shadow-md">
                  <div className="bg-custom-gray h-[34rem] p-6 rounded shadow-md w-[22rem] max-w-md mb-4 md:mb-0 flex flex-col items-center">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddToCart(item);
                      }}
                    >
                      <input type='text' value={userId} readOnly /><br />
                      <label>Menu list Id</label><br />
                      <input type='text' value={item._id} readOnly /><br />
                      <label>Category</label><br />
                      <input type='text' value={item.category} readOnly /><br />
                      <label>Food name</label><br />
                      <input type='text' value={item.type} readOnly /><br />
                      <label>Price</label><br />
                      <input type='text' value={item.price} readOnly /><br />
                      <button type='submit'>Add to cart</button>
                    </form>
                  </div>
                  <div className="text-white font-spartan font-thin w-[19rem] h-auto rounded mx-auto mt-2">Rs.{item.price}/-</div>
                  <div className="text-center text-white font-spartan font-thin mt-8 text-3xl">{item.type}</div>
                  <div className="text-center text-white font-spartan font-thin text-2xl mt-2">{item.category}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white-700">No menu items available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowMenuLists;
