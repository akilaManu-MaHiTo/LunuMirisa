import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Loader from './Components/Loader.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faMartiniGlass, faPizzaSlice, faPepperHot, faFireFlameCurved, faCartShopping, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowMenuLists = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [error, setError] = useState('');
  const [topThreeItems, setTopThreeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Meals');
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
      .then(response => {
        const uniqueItems = response.data.filter((item, index, self) => 
          index === self.findIndex((i) => i._id === item._id)
        );
        setTopThreeItems(uniqueItems);
        console.log("Unique top three items: ", uniqueItems);  // Correctly logging the unique top three items
      })
      .catch(() => toast.error('Error fetching top three items!'));
  };
  

  const handleAddToCart = (item) => {
    const scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', scrollPosition);

    axios.post("http://localhost:3001/Addtocarts", {
      userId,
      itemId: item._id,
      category: item.category,
      title: item.title,
      price: item.price,
      image:item.image,
    })
    .then(() => {
      toast.success(`${item.title} added to cart successfully!`);
      window.location.reload();
    })
    .catch(() => {
      toast.error(`Error adding ${item.title} to cart. Please try again!`);
    });
  };
  
  const handleCategoryClick = (category) => {
    setFade(true);
    setTimeout(() => {
      setSelectedCategory(category);
      if (category === 'All Meals') {
        setFilteredItems(menuItems);
        fetchTopThreeItems();
      } else {
        setFilteredItems(menuItems.filter(item => item.category === category));
        setTopThreeItems([]);
      }
      setFade(false);
    }, 300);
  };

  // Filter items based on search term
  useEffect(() => {
    const filtered = menuItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, menuItems]); // Re-run when searchTerm or menuItems change

  if (loading) return <Loader />;

  return (
    <div className="bg-custom-black">
      <NavigationBar logo={logo} />

      {/* Search Input */}
      <div className="flex justify-center mt-6">
        <input 
          type="text"
          placeholder="Search menu items..."
          className="p-3 w-[20rem] md:w-[30rem] rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>

      {/* Category Buttons */}
      <div className="flex justify-center my-10 md:mx-20 lg:mx-32 flex-wrap bg-custom-black">
        {['All Meals', 'Appetizers', 'Main Course', 'Specials', 'Beverages'].map((category, idx) => (
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
      {selectedCategory === 'All Meals' && searchTerm === '' && (  
        <div className="bg-custom-black flex flex-col items-center">
          <h2 className="text-white text-4xl font-thin mb-10 self-start ml-64 ">Today's Hot Items</h2>
          {topThreeItems.length > 0 ? (
            <div className=" justify-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {topThreeItems.map(item => (
                <TopThreeItemCard key={item._id} item={item} onAddToCart={() => handleAddToCart(item)} />
              ))}
            </div>
          ) : (
            <div className='flex gap-8'>
              <div
                class="flex flex-col bg-custom-gray w-64 h-96 animate-pulse rounded-xl p-4 gap-4"
              >
                <div class="bg-neutral-400/50 w-full h-32 animate-pulse rounded-md"></div>
                <div class="flex flex-col gap-2">
                  <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
                </div>
              </div>
              <div
                class="flex flex-col bg-custom-gray w-64 h-96 animate-pulse rounded-xl p-4 gap-4"
              >
                <div class="bg-neutral-400/50 w-full h-32 animate-pulse rounded-md"></div>
                <div class="flex flex-col gap-2">
                  <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
                </div>
              </div>
              <div
                class="flex flex-col bg-custom-gray w-64 h-96 animate-pulse rounded-xl p-4 gap-4"
              >
                <div class="bg-neutral-400/50 w-full h-32 animate-pulse rounded-md"></div>
                <div class="flex flex-col gap-2">
                  <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div class="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>


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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
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
  <div className="bg-custom-gray p-6 rounded shadow-md w-full max-w-xs transition-transform duration-300 hover:shadow-lg hover:scale-105 relative">


    <div class="group card w-[220px] h-[185px] mx-auto mt-5 bg-custom-gray  text-[30px] font-black transition-all duration-400 hover:cursor-pointer hover:scale-[1] hover:bg-custom-gray">
      <div class="first-content flex justify-center items-center w-full h-full transition-all duration-400 opacity-100 group-hover:opacity-0 group-hover:h-0">
        <img 
          src={`http://localhost:3001/Images/` + item.image} 
          alt={item.name} 
          className="w-full h-48 bg-cover mx-auto bg-center mt-5"
        />
      </div>
      <div class="second-content flex justify-center items-center w-full h-0 opacity-0 transition-all duration-400 text-[0rem] transform rotate-90 scale-[-1] group-hover:h-full group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100 group-hover:text-[1.8rem]">
        <span className='text-white w-52 h-32 mb-10 whitespace-normal font-thin text-justify'>
          <strong className='font-semibold text-lg'>Ingredients</strong>
          <p className='mt-2 w-46 h-28 overflow-y-scroll text-sm'>{item.description}</p>
        </span>
      </div>
    </div>

    <h3 className="text-white text-xl font-light mt-10 mb-5">{item.title}</h3>
    <p className="text-white text-3xl font-thin mb-2">Rs.{item.price}/-</p>
    <div className="absolute top-3 right-5">
      <FontAwesomeIcon icon={getIconForCategory(item.category)} className="text-white" />
    </div>

    <button onClick={onAddToCart} className="w-full text-lg  bg-custom-light text-white hover:bg-white hover:text-black h-12 mt-3 mb-3 py-2 px-4 transition duration-300 hover:scale-105 group">
      Add to cart 
      <FontAwesomeIcon 
        icon={faCartPlus} 
        className="ml-3 group-hover:animate-bounce-custom" 
      />
    </button>



  </div>
);



const TopThreeItemCard = ({ item, onAddToCart }) => (
<div className="bg-custom-gray p-6 rounded shadow-md w-full max-w-xs transition-transform duration-300 hover:scale-105 hover:shadow-lg relative">
  {/* Ribbon for hot item */}
  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
    <div className="bg-red-600 text-white text-center pl-[5.5rem] text-sm font-bold px-3 py-1 absolute top-[-1rem] right-[-45px] w-48 transform rotate-45">
     HOT <FontAwesomeIcon icon={faFireFlameCurved} />
    </div>
  </div>

  <div class="group card w-[220px] h-[185px] mx-auto mt-5 bg-custom-gray  text-[30px] font-black transition-all duration-400 hover:cursor-pointer hover:scale-[1] hover:bg-custom-gray">
    <div class="first-content flex justify-center items-center w-full h-full transition-all duration-400 opacity-100 group-hover:opacity-0 group-hover:h-0">
      <img 
        src={`http://localhost:3001/Images/` + item.image} 
        alt={item.name} 
        className="w-full h-48 bg-cover mx-auto bg-center mt-5"
      />
    </div>
    <div class="second-content flex justify-center items-center w-full h-0 opacity-0 transition-all duration-400 text-[0rem] transform rotate-90 scale-[-1] group-hover:h-full group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100 group-hover:text-[1.8rem]">
      <span className='text-white w-52 h-32 mb-10 whitespace-normal font-thin text-justify'>
        <strong className='font-semibold text-lg'>Ingredients</strong>
        <p className='mt-2 w-46 h-28 overflow-y-scroll text-sm'>{item.description}</p>
      </span>
    </div>
  </div>

  <h3 className="text-white text-xl font-light mt-10 mb-5">{item.title}</h3>
  <p className="text-white text-3xl font-thin mb-2">Rs.{item.maxPrice}/-</p>
  <button onClick={onAddToCart} className="w-full text-lg  bg-custom-light text-white hover:bg-white hover:text-black h-12 mt-3 mb-3 py-2 px-4 transition duration-300 hover:scale-105 group">
      Add to cart 
      <FontAwesomeIcon 
        icon={faCartPlus} 
        className="ml-3 group-hover:animate-bounce-custom" 
      />
    </button>
</div>


);

// Function to get icon for category
const getIconForCategory = (category) => {
  switch (category) {
    case 'Appetizers':
      return faBreadSlice;
    case 'Main Course':
      return faPizzaSlice;
    case 'Specials':
      return faPepperHot;
    case 'Beverages':
      return faMartiniGlass;
    default:
      return null;
  }
};

export default ShowMenuLists;
