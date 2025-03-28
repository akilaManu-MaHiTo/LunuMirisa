import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import AdminNaviBar from './Components/AdminNavigationBar';
import ToggleSlideBar from './Components/ToggleSlideBar';
import useSidebar from './Components/useSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faPenToSquare, faTruckArrowRight, faTrashCan, faBell, faFilePdf, faSync } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Components/Loader.jsx';
import logo from '../Images/Logo.png'

const ShowInventory = () => {
  const [count, setCount] = useState(0);
  const { isSidebarVisible, toggleSidebar, sidebarRef } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [maxQuantity, setMaxQuantity] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get("https://lunu-mirisa.vercel.app/ShowInventory")
      .then(response => {
        setInventory(response.data);
        setFilteredInventory(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the inventory items!", error);
        setError('There was an error fetching the inventory items!');
        setLoading(false);
      });
  }, []);

  const handleDeleteItem = (itemId) => {
    axios.delete(`https://lunu-mirisa.vercel.app/DeleteInventoryItem/${itemId}`)
      .then(response => {
        // After successful deletion, remove the item from the state
        setFilteredInventory(prevInventory => prevInventory.filter(item => item._id !== itemId));
      })
      .catch(error => {
        console.error("There was an error deleting the inventory item!", error);
      });
  };

  useEffect(() => {
    // Fetch the count of inventory items with status "Yes"
    axios.get('https://lunu-mirisa.vercel.app/countYesSupply')
      .then(response => {
        setCount(response.data.count);
      })
      .catch(error => {
        console.error("There was an error fetching the count!", error);
      });
  }, []);
  

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterInventory(category, maxQuantity, searchQuery);
  };

  const handleMaxQuantityChange = (event) => {
    setMaxQuantity(parseInt(event.target.value));
    filterInventory(selectedCategory, event.target.value, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterInventory(selectedCategory, maxQuantity, query);
  };

  const filterInventory = (category, max, search) => {
    let filtered = inventory;
  
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
  
    if (max !== 5) {
      filtered = filtered.filter(item => item.quantity <= max);
    }
  
    if (search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }
  
    const sorted = filtered.sort((a, b) => {
      if (a.quantity < 5 && a.quantity < a.maxQuantity && (b.quantity >= 5 || b.quantity === b.maxQuantity)) return -1;
      if ((a.quantity >= 5 || a.quantity === a.maxQuantity) && b.quantity < 5 && b.quantity < b.maxQuantity) return 1;
      return a.quantity - b.quantity;
    });
  
    setFilteredInventory(sorted);
  };

  useEffect(() => {
    filterInventory(selectedCategory, maxQuantity, searchQuery);
  }, [maxQuantity, selectedCategory, searchQuery]);

// Generate PDF report
const generateReport = () => {
  const doc = new jsPDF();

  // Add logo to the top-left corner
  const img = new Image();
  img.src = logo; // Path to your logo
  doc.addImage(img, 'PNG', 10, 10, 25, 20); // Adjust logo size and position

  // Centered title for the report
  doc.setFontSize(16);
  doc.text('Inventory Report', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // Right corner contact info with smaller font size
  doc.setFontSize(7); // Smaller font size for the contact info
  const todayDate = new Date().toLocaleDateString(); // Get today's date
  doc.text([
    'Email: lunumirisasrilanka@gmail.com',
    'Tel: 0766670918',
    'Facebook: lunumirisa',
    `Date: ${todayDate}`
  ], doc.internal.pageSize.getWidth() - 50, 15); // Adjust the X position

  // Add a line below the header to separate content
  doc.line(10, 30, doc.internal.pageSize.getWidth() - 10, 30);

  // Set up headers for the inventory report
  doc.setFontSize(12);
  const headers = ["Item Name", "Current Quantity", "Max Quantity", "Category", "Status"];
  const data = filteredInventory.map(item => {
    let status = 'Normal'; // Default status

    // Determine item status based on quantity
    if (item.quantity < 5 && item.quantity !== item.maxQuantity) {
      status = 'Low';
    } else if (item.quantity === item.maxQuantity) {
      status = 'Fine';
    } else if (item.quantity < item.maxQuantity && item.maxQuantity === 5) {
      status = 'Low';
    }

    return [item.name, item.quantity, item.maxQuantity, item.category, status];
  });

  // Add the inventory table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 35, // Adjusted to start below the header
    theme: 'grid',
    headStyles: {
      fillColor: [4, 73, 71],
      textColor: [255, 255, 255],
      halign: 'center',
    },
    bodyStyles: {
      halign: 'center',
      fontSize: 10, // Adjust font size for body text
    },
    alternateRowStyles: {
      fillColor: [255, 244, 181]
    },
  });

  // Closing statement
  doc.setFontSize(9);
  const finalPageHeight = doc.internal.pageSize.getHeight();
  doc.text('This report was generated by Lunumirisa, Sri Lanka', 14, finalPageHeight - 30);
  doc.text('..............................', 14, finalPageHeight - 20);
  doc.text('Signed by Manager', 14, finalPageHeight - 15);
  doc.text(`Date: ${todayDate}`, 14, finalPageHeight - 10);

  // Save the PDF with the current date in the filename
  doc.save(`inventory_report_${todayDate}.pdf`);
};



  const SidebarWithOverlay = () => (
    <div className="flex">
      <ToggleSlideBar ref={sidebarRef} isVisible={isSidebarVisible} />
      {isSidebarVisible && (
        <div
          className="fixed inset-0 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-custom-black">
      <AdminNaviBar selectedPage="Inventory Management" />

      <div className="p-2 flex items-center justify-end mt-10">
        <div className="flex space-x-4 custom1-md:mr-[4rem]">
          {/* Search Bar */}
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search items..."
            className="p-5 w-[21rem] bg-custom-gray text-white h-auto rounded-3xl border border-white transition-all duration-300 ease-out transform hover:scale-105"
          />

          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="p-5 w-[10rem] bg-custom-gray text-white h-auto rounded-3xl border border-white transition-all duration-300 ease-out transform hover:scale-105"
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Spices">Spices</option>
            <option value="Meat">Meat</option>
            <option value="Fisheries">Fisheries</option>
          </select>

          {/* Max Quantity Filter */}
          <div className="flex items-center space-x-4 pr-6 pl-8 bg-custom-gray text-white rounded-3xl border border-white ">
            <label className="text-white">Filter By Quantity</label>
            <input 
              type="range" 
              min="0" 
              max="5" 
              value={maxQuantity} 
              onChange={handleMaxQuantityChange}
              className="w-28 h-2 bg-black rounded-lg outline-none focus:ring-1 focus:ring-white slider transition-all duration-300 ease-out transform hover:scale-105"
            />
            <span className="text-white">{maxQuantity}</span>
          </div>

          <Link to='/Inventory'>
            <button 
              className="p-3 h-16 w-[10rem] bg-custom-gray text-white rounded-3xl border border-white transition-all duration-300 ease-out transform hover:scale-105"
            >
              Add Items <FontAwesomeIcon icon={faPlus} />
            </button>
          </Link>

          {/* Generate Report Button */}
          <button 
            className="p-3 h-16 w-[12rem] bg-custom-gray text-white rounded-3xl border border-white transition-all duration-300 ease-out transform hover:scale-105"
            onClick={generateReport}
          >
            Generate Report <FontAwesomeIcon icon={faFilePdf} className='ml-2' />
          </button>
          <Link to='/ShowAcceptedOrders'>
            <button 
              className="p-3 h-16 w-[5rem] text-xl text-white border rounded-3xl bg-custom-gray border-white "
            >
              <FontAwesomeIcon icon={faBell} /> <span className='absolute top-[10.4rem] text-white text-lg'>{count}</span>
            </button>
          </Link>

        </div>
      </div>

      <SidebarWithOverlay />

      <div className="flex items-center justify-center bg-custom-black mt-10">
        <div className="bg-custom-toolight p-6 rounded shadow-md w-full max-w-[106rem]">
          <h2 className="text-2xl text-center font-bold mb-4">{selectedCategory || "All Categories"}</h2>

          {/* Inventory List */}
          <div className="grid grid-cols-8 text-gray-600 mb-4 font-semibold space-x-3 mt-16">
            <span>Image</span>
            <span>Item Name</span>
            <span>Current Quantity</span>
            <span>Max Quantity</span>
            <span>Quantity Status</span>
            <span>Update</span>
            <span>Place Order</span>
            <span>Delete Item</span>
          </div>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            filteredInventory.length === 0 ? (
              <div className='flex items-center p-10 justify-center text-center'>No inventory items found.</div>
            ) : (
              <ul>
                {filteredInventory.map((item) => (
                  <li key={item._id} className="bg-slate-200 grid grid-cols-8 mb-4 p-4 border rounded items-center space-x-6 border-custom-black">
                    <img 
                      src={`https://lunu-mirisa.vercel.app/Images/` + item.image} 
                      alt={item.name} 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <div className="text-xl font-semibold">{item.name}</div>
                    <div>{item.quantity}kg</div>
                    <div>{item.maxQuantity}kg</div>
                    {item.quantity < 5 && item.quantity !== item.maxQuantity ? (
                      <div className="text-white bg-red-500 rounded-md w-20 text-center h-11 font-semibold pt-2 select-none ">Low</div>
                    ) : item.quantity === item.maxQuantity ? (
                      <div className="text-white bg-green-700 rounded-md w-20 text-center h-11 font-semibold pt-2 select-none">Fine</div>
                    ) : item.quantity < item.maxQuantity && item.maxQuantity === 5 ? (
                      <div className="text-white bg-red-500 rounded-md w-20 text-center h-11 font-semibold pt-2 select-none">Low</div>
                    ) : (
                      <div className="text-white bg-yellow-500 rounded-md w-20 text-center h-11 font-bold pt-2 select-none">Normal</div>
                    )}
                    <div><Link to={`/UpdateInventory/${item._id}`}><button className='bg-custom-light p-3 text-white hover:bg-white hover:text-black hover:border hover:border-black rounded-xl transition-all duration-300 ease-out transform hover:scale-105'>Update  <FontAwesomeIcon icon={faSync} /></button></Link></div>
                    <div><Link to={`/PlaceOrderInventory/${item._id}`}><button className='bg-blue-600 p-3 text-white rounded-xl hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-300 ease-out transform hover:scale-105 '>Order <FontAwesomeIcon icon={faTruckArrowRight} /></button></Link></div>
                    <div>
                        <button 
                          className='bg-red-600 text-white px-4 py-3 ml-4 rounded-xl hover:bg-red-400 hover:text-black transition-all duration-300 ease-out transform hover:scale-105' 
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>

                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>      
    </div>
  );
};

export default ShowInventory;
