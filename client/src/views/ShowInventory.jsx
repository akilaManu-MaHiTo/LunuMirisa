import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import AdminNaviBar from './Components/AdminNavigationBar';
import ToggleSlideBar from './Components/ToggleSlideBar';
import useSidebar from './Components/useSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faPenToSquare, faTruckArrowRight, faTrashCan, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Components/Loader.jsx';

const ShowInventory = () => {
  const { isSidebarVisible, toggleSidebar, sidebarRef } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [maxQuantity, setMaxQuantity] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get("http://localhost:3001/ShowInventory")
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
    axios.delete(`http://localhost:3001/DeleteInventoryItem/${itemId}`)
      .then(response => {
        // After successful deletion, remove the item from the state
        setFilteredInventory(prevInventory => prevInventory.filter(item => item._id !== itemId));
      })
      .catch(error => {
        console.error("There was an error deleting the inventory item!", error);
      });
  };
  

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
  doc.setFontSize(16);
  doc.text('Inventory Report', 20, 20);
  doc.setFontSize(12);

  const headers = ["Item Name", "Current Quantity", "Max Quantity", "Category", "Status"];
  const data = filteredInventory.map(item => {
    let status = 'Normal'; // Default status

    if (item.quantity < 5 && item.quantity !== item.maxQuantity) {
      status = 'Low';
    } else if (item.quantity === item.maxQuantity) {
      status = 'Fine';
    } else if (item.quantity < item.maxQuantity && item.maxQuantity === 5) {
      status = 'Low';
    }

    return [item.name, item.quantity, item.maxQuantity, item.category, status];
  });

  doc.autoTable({
    head: [headers],
    body: data,
    startY: 30,
  });

  doc.save('inventory_report.pdf');
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

      <div className="p-5 custom1-md:pl-[4rem]">
        <button
          className="text-white text-2xl focus:outline-none"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className="p-2 flex items-center justify-end">
        <div className="flex space-x-4 custom1-md:mr-[4rem]">
          {/* Search Bar */}
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search items..."
            className="p-5 w-[10rem] bg-custom-gray text-white h-auto rounded-3xl border border-white"
          />

          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="p-5 w-[10rem] bg-custom-gray text-white h-auto rounded-3xl border border-white"
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Spices">Spices</option>
            <option value="Meat">Meat</option>
            <option value="Fisheries">Fisheries</option>
          </select>

          {/* Max Quantity Filter */}
          <div className="flex items-center space-x-4 pr-6 pl-8 bg-custom-gray text-white rounded-3xl border border-white">
            <label className="text-white">Filter By Quantity</label>
            <input 
              type="range" 
              min="0" 
              max="5" 
              value={maxQuantity} 
              onChange={handleMaxQuantityChange}
              className="w-28 h-2 bg-black rounded-lg outline-none focus:ring-1 focus:ring-white slider"
            />
            <span className="text-white">{maxQuantity}</span>
          </div>

          <Link to='/Inventory'>
            <button 
              className="p-3 h-16 w-[10rem] bg-custom-gray text-white rounded-3xl border border-white"
            >
              Add Items <FontAwesomeIcon icon={faPlus} />
            </button>
          </Link>

          {/* Generate Report Button */}
          <button 
            className="p-3 h-16 w-[10rem] bg-custom-gray text-white rounded-3xl border border-white"
            onClick={generateReport}
          >
            Generate Report
          </button>
          <Link to='/ShowAcceptedOrders'>
            <button 
              className="p-3 h-16 w-[10rem] bg-custom-gray text-white rounded-3xl border border-white"
            >
              Supplies <FontAwesomeIcon icon={faBagShopping} />
            </button>
          </Link>

        </div>
      </div>

      <SidebarWithOverlay />

      <div className="flex items-center justify-center bg-custom-black mt-10">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-[106rem]">
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
                      src={`http://localhost:3001/Images/` + item.image} 
                      alt={item.name} 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <div className="text-xl font-semibold">{item.name}</div>
                    <div>{item.quantity}kg</div>
                    <div>{item.maxQuantity}kg</div>
                    {item.quantity < 5 && item.quantity !== item.maxQuantity ? (
                      <div className="text-white bg-red-500 rounded-md w-20 text-center h-11 font-semibold pt-2">Low</div>
                    ) : item.quantity === item.maxQuantity ? (
                      <div className="text-white bg-green-700 rounded-md w-20 text-center h-11 font-semibold pt-2">Fine</div>
                    ) : item.quantity < item.maxQuantity && item.maxQuantity === 5 ? (
                      <div className="text-white bg-red-500 rounded-md w-20 text-center h-11 font-semibold pt-2">Low</div>
                    ) : (
                      <div className="text-white bg-yellow-500 rounded-md w-20 text-center h-11 font-bold pt-2">Normal</div>
                    )}
                    <div><Link to={`/UpdateInventory/${item._id}`}><button>Update  <FontAwesomeIcon icon={faPenToSquare} /></button></Link></div>
                    <div><Link to={`/PlaceOrderInventory/${item._id}`}><button>Order <FontAwesomeIcon icon={faTruckArrowRight} /></button></Link></div>
                    <div>
                        <button 
                          className='text-red-500' 
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          Delete <FontAwesomeIcon icon={faTrashCan} />
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
