import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import EmployeeNavigation from './Components/EmployeeNavigation';
import logo from '../Images/Logo.png';
import bgWaitor from '../Images/waitor-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUtensils } from '@fortawesome/free-solid-svg-icons';

const InOrder = () => {
  const [tables, setTables] = useState([]); // State to hold fetched tables
  const [selectedTable, setSelectedTable] = useState(''); // State to hold selected table
  const [orderId, setOrderId] = useState(null); // State to hold the created order ID
  const { userId } = useParams(); // Destructure userId from useParams
  const navigate = useNavigate(); // Replaces useHistory

  useEffect(() => {
    // Fetch table data from the API
    axios.get('https://lunu-mirisa.vercel.app/ShowTable')
      .then(response => {
        setTables(response.data); // Set the response data to state
      })
      .catch(error => {
        console.error("There was an error fetching the table data!", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (selectedTable) {
      // Send the POST request to create an order with the selected table number
      axios.post('https://lunu-mirisa.vercel.app/createOrderTable', { tableNum: selectedTable })
        .then(response => {
          console.log("Order created successfully!", response.data);
          const orderId = response.data.order.id; // Use the returned order ID directly
          const tableNum = response.data.order.tableNum;
          const OrderTime = response.data.order.OrderTime;
          const ongoing = response.data.order.ongoing;
          setOrderId(orderId); // Update the state, if needed elsewhere
          navigate(`/InOrder/${orderId}/${userId}/${tableNum}/${OrderTime}/${ongoing}`); // Navigate using the correct order ID directly
        })
        .catch(error => {
          console.error("There was an error creating the order!", error);
        });
    } else {
      console.log("Please select a table before submitting.");
    }
  };

  return (
    <div>
      <EmployeeNavigation logo={logo} selectedPage="Menu"  />
      <div className="bg-gray-800 min-h-screen text-gray-200"
          style={{ 
            backgroundImage: `url(${bgWaitor})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
          }}
      >
        <div className='flex flex-col md:flex-row justify-center items-center p-6'>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <div className='justify-center bg-custom-light border-white mt-10 p-10 rounded-lg'>
            <h1 className='text-white text-3xl font-thin mb-6'>Create a New Order</h1>
            
            <form onSubmit={handleSubmit} className='bg-custom-toolight p-10 rounded-lg shadow-md w-80'>
              <label htmlFor="tableSelect" className='text-black text-lg mb-5'>Select Table Number:</label>
              <select
                name="tableNumber"
                id="tableSelect"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className='block p-2 mb-4 mt-5 text-lg border border-gray-700 rounded-lg bg-black text-gray-300 '
              >
                <option value="">Select Table</option>
                {tables.map((table) => (
                  <option key={table._id} value={table.tableNum}>
                    {table.tableNum}
                  </option>
                ))}
              </select>

              <button type='submit' className='w-full mt-10 bg-black text-white p-2 rounded-lg hover:bg-white hover:border hover:border-black hover:text-black  transition duration-500 hover:scale-105'>
                Submit
              </button>
            </form>              
            </div>
            
          </div>

          <div className='border-l-2 border-white h-64 mx-4'></div> {/* Vertical Divider */}

          <div className='flex-1 flex flex-col justify-center items-center'>
            <div className='bg-custom-light rounded-lg p-10 h-80 '>

              <h2 className='text-white text-3xl font-thin mb-4'>Manage Your Orders</h2>
              <p className='text-gray-300 mb-1'>Click below to view and manage your existing orders.</p>
              <p className='text-gray-300 text-sm'>
                View and manage your existing orders here.
              </p>
              
                <Link to={`/ShowMyOrders/${userId}`}>
                  <button className='bg-black text-white mt-20 p-3 rounded-lg hover:bg-white hover:text-black transition duration-500'>
                    Show My Orders <FontAwesomeIcon icon={faArrowRight} className='ml-2'/>
                  </button>
                </Link> 



            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InOrder;
