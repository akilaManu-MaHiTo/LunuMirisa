import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import EmployeeNavigation from './Components/EmployeeNavigation';

const InOrder = () => {
  const [tables, setTables] = useState([]); // State to hold fetched tables
  const [selectedTable, setSelectedTable] = useState(''); // State to hold selected table
  const [orderId, setOrderId] = useState(null); // State to hold the created order ID
  const { userId } = useParams(); // Destructure userId from useParams
  const navigate = useNavigate(); // Replaces useHistory

  useEffect(() => {
    // Fetch table data from the API
    axios.get('http://localhost:3001/ShowTable')
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
      axios.post('http://localhost:3001/createOrderTable', { tableNum: selectedTable })
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
    <div className="bg-gray-800 min-h-screen text-gray-200">
      <EmployeeNavigation />
      <div className='flex flex-col md:flex-row justify-center items-center p-6'>
        <div className='flex-1 flex flex-col justify-center items-center'>
          <h1 className='text-white text-3xl font-bold mb-6'>Create a New Order</h1>
          
          <form onSubmit={handleSubmit} className='bg-gray-900 p-6 rounded-lg shadow-md w-80'>
            <label htmlFor="tableSelect" className='text-gray-300 text-lg mb-2'>Select Table Number:</label>
            <select
              name="tableNumber"
              id="tableSelect"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className='block p-2 mb-4 text-lg border border-gray-700 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select Table</option>
              {tables.map((table) => (
                <option key={table._id} value={table.tableNum}>
                  {table.tableNum}
                </option>
              ))}
            </select>

            <button type='submit' className='w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200'>
              Submit
            </button>
          </form>
        </div>

        <div className='border-l-2 border-gray-700 h-64 mx-4'></div> {/* Vertical Divider */}

        <div className='flex-1 flex flex-col justify-center items-center'>
          <h2 className='text-white text-xl mb-4'>Manage Your Orders</h2>
          <p className='text-gray-300 mb-4'>Click below to view and manage your existing orders.</p>
          
          <Link to={`/ShowMyOrders/${userId}`}>
            <button className='bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition duration-200'>
              Show My Orders
            </button>
          </Link>
          <p className='text-gray-300 mt-2 text-sm text-center'>
            View and manage your existing orders here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InOrder;
