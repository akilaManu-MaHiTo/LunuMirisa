import React, { useEffect, useState } from 'react';
import AdminNaviBar from './Components/AdminNavigationBar';
import ToggleSlideBar from './Components/ToggleSlideBar';
import useSidebar from './Components/useSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faPenToSquare, faTruckArrowRight, faTrashCan } from '@fortawesome/free-solid-svg-icons';
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

  useEffect(() => {
    axios.get("http://localhost:3001/ShowInventory")
      .then(response => {
        setInventory(response.data);
        setFilteredInventory(response.data); // Initialize with all items
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the inventory items!", error);
        setError('There was an error fetching the inventory items!');
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterInventory(category, maxQuantity);
  };

  const handleMaxQuantityChange = (event) => {
    setMaxQuantity(parseInt(event.target.value));
  };

  const filterInventory = (category, max) => {
    let filtered = inventory;
  
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
  
    if (max !== 5) {
      filtered = filtered.filter(item => item.quantity <= max);
    }
  
    // Sort by low inventory first, then by quantity, while ensuring items with maxQuantity aren't marked as low
    const sorted = filtered.sort((a, b) => {
      if (a.quantity < 5 && a.quantity < a.maxQuantity && (b.quantity >= 5 || b.quantity === b.maxQuantity)) return -1;
      if ((a.quantity >= 5 || a.quantity === a.maxQuantity) && b.quantity < 5 && b.quantity < b.maxQuantity) return 1;
      return a.quantity - b.quantity;
    });
  
    setFilteredInventory(sorted);
  };
  

  useEffect(() => {
    filterInventory(selectedCategory, maxQuantity);
  }, [maxQuantity, selectedCategory]);

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

          <div className="flex items-center space-x-4 pr-6 pl-8  bg-custom-gray text-white rounded-3xl border border-white">
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
        </div>
      </div>

      <SidebarWithOverlay />

      <div className="flex items-center justify-center bg-custom-black mt-10">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-[106rem]">
          <h2 className="text-2xl text-center font-bold mb-4">{selectedCategory || "All Categories"}</h2>

          {/* Topics Section */}
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
                      src={`http://localhost:3001/Images/`+item.image} 
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
                    ) : item.quantity < item.maxQuantity && item.maxQuantity===5 ?(
                      <div className="text-white bg-red-500 rounded-md w-20 text-center h-11 font-semibold pt-2">Low</div>
                    ) : (
                      <div className="text-white bg-yellow-500 rounded-md w-20 text-center h-11 font-bold pt-2">Normal</div>
                    )}
                    <div><Link to="/UpdateInventory"><button>Update  <FontAwesomeIcon icon={faPenToSquare} /></button></Link></div>
                    <div><Link to={`/PlaceOrderInventory/${item._id}`}><button>Order <FontAwesomeIcon icon={faTruckArrowRight} /></button></Link></div>
                    <div><button className='text-red-500'>Delete <FontAwesomeIcon icon={faTrashCan} /></button></div>
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
