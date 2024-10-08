import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Components/ToggleSlideBar';
import NavigationBar from './Components/NavigationMenuListManager';
import logo from '../Images/Logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faTrashCan, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'; 


const ShowMangerMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState({}); // State to store selected percentages
  const [searchTerm, setSearchTerm] = useState(''); // For title search
  const [selectedCategory, setSelectedCategory] = useState(''); // For category filter

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

  const handleDelete = (id) => {
    // Show a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    
    if (confirmDelete) {
        // Proceed with the delete operation if confirmed
        axios.delete('http://localhost:3001/deleteMenuList/' + id)
            .then(res => {
                console.log(res);
                setMenuItems(menuItems.filter(item => item._id !== id)); // Update state to remove the deleted item
                toast.success("Item deleted successfully."); // Notify the user of successful deletion
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to delete item."); // Notify the user of an error
            });
    } else {
        // If the user cancels the deletion
        toast.info("Item deletion cancelled."); // Notify the user that deletion was cancelled
    }
};

const handleHotDealsToggle = (itemId) => {
  const selectedPerc = selectedPercentage[itemId]; // Get the selected percentage
  const item = menuItems.find(item => item._id === itemId); // Find the current item

  // Check if a percentage is selected for adding hot deals
  if (item.hotDeals === "No" && !selectedPerc) {
    alert("Please select a Hot Deal Percentage before adding."); // Alert user to select a percentage
    return; // Exit the function if no percentage is selected
  }

  // Determine the new hotDeals status
  const newHotDealsStatus = item.hotDeals === "Yes" ? "No" : "Yes";

  // Make the API request to toggle hot deals
  axios.put(`http://localhost:3001/UpdateHotDeals/${itemId}`, { 
    hotDeals: newHotDealsStatus, 
    percentage: newHotDealsStatus === "Yes" ? selectedPerc : null // Only set percentage if adding hot deal
  })
  .then(res => {
      // Update the state with the new hot deals status and percentage
      setMenuItems(menuItems.map(item =>
          item._id === itemId ? { ...item, hotDeals: newHotDealsStatus, percentage: newHotDealsStatus === "Yes" ? selectedPerc : null } : item
      ));
  })
  .catch(err => console.log(err));
};

const handlePercentageSelect = (itemId, percentage) => {
  setSelectedPercentage({
      ...selectedPercentage,
      [itemId]: percentage,
  });
};


  // Filter menu items based on search term and selected category
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesTitle;
  });

  return (
    <div>
      <NavigationBar logo={logo} />
      <Sidebar />
      <div className="flex items-center justify-center min-h-screen bg-black"
      >
        <h1 className="absolute top-10 text-white text-2xl font-thin text-center">Update Menu</h1>
        <div className="bg-black lg shadow-md w-full h-full max-w-4xl">

          <h2 className="text-white text-2xl font-light mb-4 mt-20">Menu Items</h2>
          {error && <p className="text-red-500">{error}</p>}

          {/* Search and Filter Section */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-md"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-md"
            >
              <option value="">All Categories</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Main Course">Main Course</option>
              <option value="Specials">Specials</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-custom-dark p-6 rounded shadow-md">
                  <img
                    src={`http://localhost:3001/Images/${item.image}`}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded shadow-md"
                  />
                  <div className="text-center mt-7 text-white font-spartan font-thin text-3xl">{item.title}</div>
                  <div className="text-center text-white font-spartan font-thin text-2xl mt-2">{item.category}</div>
                  <div className="text-white font-spartan font-thin w-[19rem] text-2xl text-center h-auto rounded mx-auto mt-2">Rs.{item.price}/-</div>
                  <div className='flex gap-3 mt-5'>
                    <Link to={`/UpdateMenuList/${item._id}`}>
                      <button className='flex items-center text-black bg-white hover:bg-black hover:text-white p-2 rounded-md mr-2 transition-all duration-300 ease-in-out hover:scale-105 '>
                        <FontAwesomeIcon icon={faSyncAlt} className='mr-2' />
                        Update
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(item._id)} className='text-white bg-red-600 hover:text-black hover:bg-red-500 p-2 rounded-md  transition-all duration-300 ease-in-out hover:scale-105'>
                      <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </button>
                  </div>

                  {/* Hot Deals Section */}
                  <div className="my-5">
                    <label htmlFor={`percentage-select-${item._id}`} className="text-white mr-2">
                      Hot Deal Percentage
                    </label>
                    <select
                        id={`percentage-select-${item._id}`} // Associate label with select
                        value={selectedPercentage[item._id] || item.percentage} // Set default to 10 if undefined
                        onChange={(e) => handlePercentageSelect(item._id, e.target.value)}
                        className="bg-gray-700 text-white p-2 rounded-md mt-2"
                        disabled={item.hotDeals === "Yes"} // Enable when hotDeals is "No"
                    >
                        <option value="">Select Hot Percentage</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="16">16%</option>
                        <option value="17">17%</option>
                        <option value="20">20%</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleHotDealsToggle(item._id)}
                    className="text-black bg-white p-2 rounded-md mt-2"
                  >
                    {item.hotDeals === "Yes" ? (
                      <>
                        <FontAwesomeIcon icon={faMinus} /> Remove Hot Deal
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} /> Add Hot Deals
                      </>
                    )}
                  </button>
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

export default ShowMangerMenuList;
