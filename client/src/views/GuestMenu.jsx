import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png'; 
import NavigationBar from './Components/NavigationSignup.jsx'; 
import Footer from './Footer.jsx';
import Loader from './Components/Loader.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faMartiniGlass, faPizzaSlice, faPepperHot, faFireFlameCurved, faCartShopping, faCartPlus, faInfoCircle, faFilePdf, faDownload } from '@fortawesome/free-solid-svg-icons'; // Added faFilePdf icon
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf'; // Added jsPDF for PDF generation
import 'jspdf-autotable';  // Import the autoTable plugin
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

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
  const [showModal, setShowModal] = useState(false);

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
        setTopThreeItems(response.data);
        console.log("Top three items: ", response.data);  // Correctly logging the top three items
      })
      .catch(() => toast.error('Error fetching top three items!'));
  };

  const handleAddToCart = () => {
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
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

  // Function to generate PDF from menu content
  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
  
    // Define the columns and rows for the table
    const tableColumn = ["Item", "Category", "Description", "Price"];
    const tableRows = [];
  
    // Loop through filtered items and prepare the data
    filteredItems.forEach(item => {
      const itemData = [
        item.title, 
        item.category, 
        item.description, 
        `Rs. ${item.price}/-`
      ];
      tableRows.push(itemData);
    });
  
    // Add title
    doc.text("Menu Items", 14, 15);
  
    // Add table with autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,  // Set starting Y position for the table
      theme: 'grid',  // Add grid lines for better visibility
      margin: { top: 10 },
      headStyles: { fillColor: [41, 128, 185] },  // Customize header background color
    });
  
    // Save the generated PDF
    doc.save("menu.pdf");
  };
  

  if (loading) return <Loader />;

  return (
    <div className="bg-custom-black">
      <NavigationBar logo={logo} />


      <div className="relative">
      {/* <button onClick={handleAddToCart} className="bg-blue-500 text-white p-2 rounded">
        Add to Cart
      </button> */}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            {/* Modal Content */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto relative">
            {/* Close Button */}
            <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200 ease-in-out"
                aria-label="Close Modal"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Hi there, I noticed that you're required to log in before adding items to your cart.
            </h2>

            <div className="flex justify-between space-x-4">
                <Link to="/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                    Login
                </button>
                </Link>

                <Link to="/create">
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                    Sign Up
                </button>
                </Link>
            </div>
            </div>
        </div>
        )}
    </div>

    
      {/* Search Input */}
      <div className="flex justify-center mt-6 gap-10">
        <input 
          type="text"
          placeholder="Search menu items..."
          className="p-3 w-[20rem] h-16 md:w-[30rem] rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />

        <div className="flex justify-center mb-6 mt-3">
          <div
            class="group relative flex justify-center items-center text-zinc-600 text-sm font-bold"
          >
            <div
              class="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md"
            >
              <div class="bg-lime-200 flex items-center gap-1 p-2 rounded-md">
                <FontAwesomeIcon icon={faFilePdf} />
                <span>File Size - 13.6 KB </span>
              </div>
              <div
                class="shadow-md bg-lime-200 absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"
              ></div>
              <div
                class="rounded-md bg-white group-hover:opacity-0 group-hover:scale-[115%] group-hover:delay-700 duration-500 w-full h-full absolute top-0 left-0"
              >
                <div
                  class="border-b border-r border-white bg-white absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"
                ></div>
              </div>
            </div>

            <div
              class="shadow-md flex items-center group-hover:gap-2  bg-white hover:bg-custom-light text-black hover:text-white p-3 rounded-xl cursor-pointer duration-300"
            >
              <FontAwesomeIcon icon={faFileLines} className='text-xl' />
                <span class="text-[0px] group-hover:text-sm duration-300" onClick={generatePDF}> Download Menu List </span>
            </div>
          </div>
        </div>
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
                className="flex flex-col bg-custom-gray w-64 h-96 animate-pulse rounded-xl p-4 gap-4"
              >
                <div className="bg-neutral-400/50 w-full h-32 animate-pulse rounded-md"></div>
                <div className="flex flex-col gap-2">
                  <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
                  <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                  <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
                </div>
              </div>
              {/* Skeleton Loading */}
            </div>
          )}
        </div>
      )}

      {/* Menu Items */}
      <div id="menu-content" className="flex items-center justify-center min-h-screen bg-custom-black mb-28">
        <div className="bg-custom-black shadow-md w-full h-full max-w-4xl">
          <h2 className="text-white text-2xl font-thin mt-6 mb-10">{selectedCategory}</h2>
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

      <Footer />
    </div>
  );
};

// Component to display each item card
const ItemCard = ({ item, onAddToCart }) => (
  <div className="bg-custom-gray p-6 rounded-lg shadow-md w-full max-w-xs transition-transform duration-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]  hover:scale-105 relative">
    <div className="relative">
      <img 
        src={`http://localhost:3001/Images/` + item.image} 
        alt={item.name} 
        className="w-full h-48 bg-cover mx-auto bg-center mt-5"
      />
      <div
        className="group absolute right-0 bottom-0 flex h-[2em] w-[2em] items-center justify-center overflow-hidden rounded-[1.5em] border-[1px] border-[#ffffffaa] bg-[#8988885c] hover:bg-black hover:opacity-80  duration-[500ms] hover:h-[12.5em] hover:w-[13.8em] hover:rounded-lg"
      >
        <FontAwesomeIcon icon={faInfoCircle} className="h-[1em] w-[1em] duration-300 group-hover:opacity-0" />
        <div
          className="items-left duration-600 absolute left-0 top-0 flex h-[13.5em] w-[14.5em] translate-y-[100%] flex-col justify-between p-[1.5em] font-nunito text-[hsl(0,0%,85%)] group-hover:translate-y-0"
        >
          <div className="items-left flex flex-col justify-center">
            <h1 className="text-[1.5em] font-bold leading-[0.8em] mb-2">Description</h1>
            <p className="text-[0.9em] font-light">
              <p className='mt-2 w-46 h-28 overflow-y-scroll custom-scrollbar text-[1rem] '>{item.description}</p>
            </p>
          </div>
        </div>
      </div>
    </div>

    <h3 className="text-white text-xl font-light mt-10 mb-4">{item.title}</h3>
    <p className="text-white text-3xl font-thin mb-2">
      <span className="text-lg">Rs.</span> {item.price}/-
    </p>

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

// Component to display top three hot items
const TopThreeItemCard = ({ item, onAddToCart }) => (
  <div className="bg-custom-gray p-6 rounded-lg shadow-md w-full max-w-xs transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)] relative">
    {/* Ribbon for hot item */}
    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
      <div className="bg-red-600 text-white text-center pl-[5.5rem] text-sm font-bold px-3 py-1 absolute top-[-1rem] right-[-45px] w-48 transform rotate-45">
       HOT <FontAwesomeIcon icon={faFireFlameCurved} />
      </div>
    </div>

    <div className="relative">
        <img 
          src={`http://localhost:3001/Images/` + item.image} 
          alt={item.name} 
          className="w-52 h-48 bg-cover mx-auto bg-center mt-5"
        />
        <div
          className="group absolute right-0 bottom-0 flex h-[2em] w-[2em] items-center justify-center overflow-hidden rounded-[1.5em] border-[1px] border-[#ffffffaa] bg-[#8988885c] hover:bg-black hover:opacity-80  duration-[500ms] hover:h-[12.5em] hover:w-[13.8em] hover:rounded-lg"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="h-[1em] w-[1em] duration-300 group-hover:opacity-0" />
          <div
            className="items-left duration-600 absolute left-0 top-0 flex h-[13.5em] w-[14.5em] translate-y-[100%] flex-col justify-between p-[1.5em] font-nunito text-[hsl(0,0%,85%)] group-hover:translate-y-0"
          >
            <div className="items-left flex flex-col justify-center">
              <h1 className="text-[1.5em] font-bold leading-[0.8em] mb-2">Description</h1>
              <p className="text-[0.9em] font-light">
                <p className='mt-2 w-46 h-28 overflow-y-scroll custom-scrollbar text-[1rem] '>{item.description}</p>
              </p>
            </div>
          </div>
        </div>
      </div>

    <h3 className="text-white text-xl font-light mt-10 mb-4">{item.title}</h3>
    <p className="text-white text-3xl font-thin mb-2">
        <span className="text-lg">Rs.</span> {item.price}/-
      </p>
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
