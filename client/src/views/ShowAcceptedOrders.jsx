import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';  // Import jsPDF
import 'jspdf-autotable';   // Import jsPDF AutoTable
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS styles for toast notifications


const AcceptedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    // Fetching data from the server
    axios.get('http://localhost:3001/acceptedOrders')
      .then(response => {
        setOrders(response.data);
        setFilteredOrders(response.data); // Initially show all orders
        calculateTotalAmount(response.data); // Calculate total amount for all orders
      })
      .catch(err => {
        setError('Failed to fetch orders');
        console.error(err);
      });
  }, []);

  const handleStatusFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
    filterOrders(selectedStatus, searchInput, deliveryDate);
  };

  const handleDeliveryDateChange = (event) => {
    const date = event.target.value;
    setDeliveryDate(date);
    filterOrders(statusFilter, searchInput, date);
  };

  const calculateTotalAmount = (ordersArray) => {
    const total = ordersArray.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalAmount(total);
  };

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Accepted Orders Report', 14, 22);
    
    // Create table
    doc.autoTable({
      head: [['ID', 'Name', 'Order Quantity', 'Category', 'Total Amount', 'Delivery Date', 'Supplier ID', 'Supplier Name', 'Status']],
      body: filteredOrders.map(order => [
        order._id,
        order.name,
        order.orderQuantity,
        order.category,
        order.totalAmount,
        new Date(order.deliveryDate).toLocaleDateString(),
        order.supplierId,
        order.supplierName,
        order.status
      ]),
      startY: 30,
      theme: 'grid',
    });

    // Save the PDF
    doc.save('accepted_orders_report.pdf');
  };

  const filterOrders = (status, input, date) => {
    let filtered = orders;

    if (status !== 'All') {
      filtered = filtered.filter(order => order.status === status);
    }

    if (input) {
      const lowerCaseInput = input.toLowerCase();
      filtered = filtered.filter(order => 
        order.name.toLowerCase().includes(lowerCaseInput) ||
        order.category.toLowerCase().includes(lowerCaseInput) ||
        order.supplierId.toLowerCase().includes(lowerCaseInput) ||
        order.supplierName.toLowerCase().includes(lowerCaseInput)
      );
    }

    if (date) {
      filtered = filtered.filter(order => {
        const orderDeliveryDate = new Date(order.deliveryDate).toISOString().split('T')[0];
        return orderDeliveryDate === date;
      });
    }

    // Sort orders by status, showing 'Yes' at the top, 'No' at the bottom
    filtered.sort((a, b) => (a.status === 'Yes' ? -1 : 1));

    setFilteredOrders(filtered);
    calculateTotalAmount(filtered);
  };

  const handleSearchInputChange = (event) => {
    const input = event.target.value;
    setSearchInput(input);
    filterOrders(statusFilter, input, deliveryDate);
  };

  const handleUpdate = (name, orderQuantity, orderId) => {
    axios.put(`http://localhost:3001/updateBySupply/${name}`, { orderQuantity })
      .then(response => {
        console.log("Inventory updated successfully!", response.data);
        toast.success("Inventory updated successfully!")
        axios.put(`http://localhost:3001/OrdersToNo/${orderId}`)
          .then(() => {
            console.log("Order deleted successfully!");
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            setFilteredOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            calculateTotalAmount(prevOrders);
          })
          .catch(err => {
            
            console.error("Failed to delete the order", err);
          });
      })
      .catch(err => {
        toast.warn("No " + name + " Found In Inventory Please Add it")
        console.error("Failed to update inventory", err);
      });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <AdminNaviBar selectedPage="Accepted Orders" />
      <Sidebar /> 
      <div className="container mx-auto p-4 text-gray-100 bg-black min-h-screen px-40">

        <div className='flex justify-between w-full mt-10 '>

          {/* Status Filter Dropdown */}
          <div className="mb-6">
            <label className="text-gray-200 mr-4">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-4 py-2 bg-white text-black rounded"
            >
              <option value="All">All Supplies</option>
              <option value="Yes">To Add Inventory</option>
              <option value="No">Added Supplies</option>
            </select>
          </div>

          {/* Single Search Bar */}
          <div className=" flex mb-6">
            <label className="text-gray-200 mr-4 mt-2">Search:</label>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="Search by Order Name, Supply Name, Supplier Name, or Supplier ID"
              className="px-4 py-2 bg-white text-black rounded w-full"
            />
          </div>

          {/* Delivery Date Filter */}
          <div className="mb-6">
            <label className="text-gray-200 mr-4">Filter by Delivery Date:</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={handleDeliveryDateChange}
              className="px-4 py-2 bg-white text-black rounded"
            />
          </div>

        </div>

        {/* Display Total Amount */}
        <div className="mb-6 mt-10 text-center text-2xl text-gray-200">
          <strong className='font-thin text-lg mb-5'>Total Amount:</strong> <p className='text-5xl font-light mt-2'>Rs.{totalAmount.toFixed(2)}</p>
        </div>

        {/* Button to generate PDF report */}
        <button 
          onClick={generatePDF}
          className="mb-6 px-4 py-2 bg-blue-500 text-white hover:bg-blue-400 hover:text-black rounded transition-all duration-300 ease-out transform hover:scale-105"
        >
          Generate PDF Report <FontAwesomeIcon icon={faFilePdf} className='ml-2' />
        </button>

        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map(order => (
            <div 
              key={order._id} 
              className={`bg-custom-dark h-[30rem] p-6 rounded-lg shadow-lg 
                          ${order.status === 'Yes' ? 'border-2 border-green-500' : 'border-4 border-red-700'}`}
            >
              <div className='flex gap-32 px-36'>
              <img 
                src={`http://localhost:3001/Images/${order.image}`} 
                alt={order.name} 
                className="w-60 h-60 mt-10 object-cover rounded-md"
              />
                <div className="mt-10 space-y-2 text-lg font-light">
                  <p>
                    <strong className='mr-3'>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong className='mr-3'>Name:</strong> {order.name}
                  </p>
                  <p>
                    <strong className='mr-3'>Order Quantity:</strong> {order.orderQuantity}
                  </p>
                  <p>
                    <strong className='mr-3'>Category:</strong> {order.category}
                  </p>
                  <p>
                    <strong className='mr-3'>Total Amount:</strong> Rs. {order.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong className='mr-3'>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className='mr-3'>Special Note:</strong> {order.specialNote || 'None'}
                  </p>
                  <p>
                    <strong className='mr-3'>Supplier Name:</strong> {order.supplierName}
                  </p>
                  <p>
                    <strong className='mr-3'>Unit Price:</strong> Rs. { (order.totalAmount / order.orderQuantity).toFixed(2) }
                  </p>
                </div>


              </div>

              <div className='flex justify-end mr-10 mt-2'>
              <button 
                className={`px-4 py-2 rounded h-14
                            ${order.status === 'Yes' ? 'bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white transition-all duration-300 ease-out transform hover:scale-105 ' : 'bg-gray-600 text-gray-300  cursor-not-allowed'}`}
                onClick={() => order.status === 'Yes' && handleUpdate(order.name, order.orderQuantity, order._id)}
                disabled={order.status !== 'Yes'} // Disable button if status is not 'Yes'
              >
                Update Inventory
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AcceptedOrders;
