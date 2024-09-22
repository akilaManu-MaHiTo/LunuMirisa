import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

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
    <div className='flex justify-center items-center min-h-screen bg-blue-600'>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tableSelect" className='text-white text-lg mb-2'>Table Number</label>
        <select
          name="tableNumber"
          id="tableSelect"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className='block p-2 mb-4 text-lg'
        >
          <option value="">Select Table</option>
          {tables.map((table) => (
            <option key={table._id} value={table.tableNum}>
              {table.tableNum}
            </option>
          ))}
        </select>
        <button type='submit' className='bg-green-500 text-white p-2 rounded'>Submit</button>
      </form>

      <Link to={`/ShowMyOrders/${userId}`}><button>Show Orders</button></Link>
    </div>
  );
};

export default InOrder;
