import React, { useState, useEffect } from 'react';
import Sidebar from './Components/ToggleSlideBar';
import AdminNaviBar from './Components/AdminNavigationBar';
import LineGraph from './Components/ReviewLineGraph';
import BarGraph from './Components/StatRingGraph';
import DoughnutChart from './Components/UserCartStat';
import Inventory from './Components/InventoryStat';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0); 
  const [menuCount, setMenuCount] = useState(0);
  const [hotCount, setHotCount] = useState(0);
  const [calculation, setCalculateByNo] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [currentInventoryIndex, setCurrentInventoryIndex] = useState(0); // Track the current inventory item
  const [isFading, setIsFading] = useState(true); // Track fading state
  const [reviewCounts, setReviewCounts] = useState([]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('https://lunu-mirisa.vercel.app/countAllUsers');
        setUserCount(response.data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  useEffect(() => {
    const fetchMenuCount = async () => {
      try {
        const response = await axios.get('https://lunu-mirisa.vercel.app/countAllmenulist');
        setMenuCount(response.data.count);
      } catch (error) {
        console.error('Error fetching menu count:', error);
      }
    };

    fetchMenuCount();
  }, []);

  useEffect(() => {
    const fetchHotCount = async () => {
      try {
        const response = await axios.get('https://lunu-mirisa.vercel.app/getHotDealsCount');
        setHotCount(response.data.count);
      } catch (error) {
        console.error('Error fetching hot count:', error);
      }
    };

    fetchHotCount();
  }, []);

  useEffect(() => {
    axios.get("https://lunu-mirisa.vercel.app/ShowInventory")
      .then(response => {
        setInventory(response.data);
      })
      .catch(error => {
        console.error("Error fetching inventory:", error);
      });
  }, []);

  // Set an interval to cycle through inventory items
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsFading(false); // Trigger fade-out
      setTimeout(() => {
        setCurrentInventoryIndex((prevIndex) => (prevIndex + 1) % inventory.length); // Change to the next item
        setIsFading(true); // Trigger fade-in
      }, 500); // Wait for fade-out to complete before switching
    }, 6000); // Change every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [inventory]);

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const response = await axios.get('https://lunu-mirisa.vercel.app/ReviewCountByRating');
        setReviewCounts(response.data);
      } catch (error) {
        console.error('Error fetching review counts:', error);
      }
    };
    fetchData();
  }, []);

  axios.get('https://lunu-mirisa.vercel.app/calculateByNo')
      .then(response => {
        setCalculateByNo(response.data.totalPrice); // Assuming your API returns { total: ... }
      })
      .catch(error => console.error('Error fetching calculateByNo:', error));

  const currentInventoryItem = inventory[currentInventoryIndex];

  return (
    <div className="bg-gray-900 h-auto min-h-screen">
      <Sidebar />
      <AdminNaviBar selectedPage="Admin Dashboard" />

      <div className="px-5 md:px-[5rem]">

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10 mt-5">
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-2xl font-spartan">User Count</h2>
            <p className="text-4xl font-bold mt-2 font-spartan">{userCount}</p>
            <p className="text-sm text-green-400 mt-2 font-spartan">+4% from last week</p>
          </div>
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md font-spartan">
            <h2 className="text-2xl">Meals Count</h2>
            <p className="text-4xl font-bold mt-2">{menuCount}</p>
            <p className="text-sm text-green-400 mt-2">+3 Added from last month</p>
          </div>
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md font-spartan">
            <h2 className="text-2xl">Hot Meals</h2>
            <p className="text-4xl font-bold mt-2">{hotCount}</p>
            <p className="text-sm text-green-400 mt-2">
              click <Link to='/ManagerMenuList'><strong>Here</strong></Link> to Add Hot Items
            </p>
          </div>
          {currentInventoryItem && (
            <div
              className={`p-4 font-spartan bg-gray-800 text-white rounded-lg shadow-md ${
                isFading ? 'animate-fadeIn' : 'animate-fadeOut'
              }`}
            >
              <h2 className="text-2xl">Inventory Item</h2>
              <div className='font-bold text-green-500 text-l'>{currentInventoryItem.name}</div>
              <p className="text-2xl font-thin mt-1">{currentInventoryItem.quantity}/{currentInventoryItem.maxQuantity} Kg</p>
              <p className="text-sm text-red-400"><Link to='/ShowInventory'><strong>Visit</strong></Link> Inventory</p>
            </div>
          )}

          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md font-spartan">
            <h2 className="text-2xl">Rating Count</h2>
            
            {/* 5-star rating */}
            {reviewCounts && reviewCounts
              .filter(rating => rating._id === 1) // Filter for 5-star rating
              .map((rating) => (
                <div key={rating._id} className="text-white mt-1 mr-10">
                  {/* Render 5 stars */}
                  {Array.from({ length: 1 }, (_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="text-lg text-yellow-200" />
                  ))}
                  <p className="text-lg font-thin inline ml-24">{rating.count} Reviews</p>
                </div>
              ))}

            {/* 1-star rating */}
            {reviewCounts && reviewCounts
              .filter(rating => rating._id === 5) // Filter for 1-star rating
              .map((rating) => (
                <div key={rating._id} className="text-white">
                  {/* Render 1 star */}
                  {Array.from({ length: 5 }, (_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="text-lg text-yellow-200" />
                  ))}
                  <p className="text-lg font-thin inline ml-4 ">{rating.count} Reviews</p>
                </div>
              ))}
              <div className='text-xs text-green-400'>View <Link to='/ShowAdminReviews'><strong>Rating</strong></Link></div>
          </div>

          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md font-spartan">
            <h2 className="text-2xl">Supplier Outgoing</h2>
            <p className="text-4xl font-bold text-red-200 mt-2"><strong className='text-lg text-white'>Rs.</strong>{calculation.toFixed(2)}</p>
            <p className="text-sm text-green-400 mt-2">Go to <Link to='/ShowAcceptedOrders'><strong>Orders</strong></Link></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-spartan">
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-10 text-center text-white">
              Income And Outgoing Status 
            </h2>
            <BarGraph />
            
          </div>

          <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold font-spartan mb-6 text-center text-white mt-6">
              Review Rating Chart
            </h2>
            <div className='text-white mb-6 text-justify font-spartan'>
                Note: The Admin Dashboard for review management should provide an overview of total reviews, average ratings, 
                and recent submissions. Key features include filtering by date, rating, and keyword, 
                along with tools to approve, reject, or flag reviews for moderation. This ensures efficient and 
                streamlined review management.
              </div>
            <LineGraph />            
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-spartan">
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">
              Inventory Graph
            </h2>
            <Inventory />
          </div>

          <div className="p-4 bg-gray-800 rounded-lg shadow-lg font-spartan">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">
              Total Price by Day
            </h2>
            <DoughnutChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
