import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AcceptedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All'); // Default to showing all orders

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

    if (selectedStatus === 'All') {
      setFilteredOrders(orders); // Show all orders if "All" is selected
      calculateTotalAmount(orders); // Calculate total amount for all orders
    } else {
      const filtered = orders.filter(order => order.status === selectedStatus);
      setFilteredOrders(filtered);
      calculateTotalAmount(filtered); // Calculate total amount for filtered orders
    }
  };

  // Function to calculate total amount from the filtered orders
  const calculateTotalAmount = (ordersArray) => {
    const total = ordersArray.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalAmount(total);
  };

  // Function to handle the update of inventory
  const handleUpdate = (name, orderQuantity, orderId) => {
    // Update inventory
    axios.put(`http://localhost:3001/updateBySupply/${name}`, { orderQuantity })
      .then(response => {
        console.log("Inventory updated successfully!", response.data);

        // After inventory update, delete the order
        axios.put(`http://localhost:3001/OrdersToNo/${orderId}`)
          .then(() => {
            console.log("Order deleted successfully!");
            // Update the state to remove the deleted order
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            setFilteredOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            calculateTotalAmount(prevOrders); // Recalculate total amount after deletion
          })
          .catch(err => {
            console.error("Failed to delete the order", err);
          });

      })
      .catch(err => {
        console.error("Failed to update inventory", err);
      });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 text-gray-100 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-200">Accepted Orders</h1>

      {/* Status Filter Dropdown */}
      <div className="mb-6">
        <label className="text-gray-200 mr-4">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          <option value="All">All Supplies</option>
          <option value="Yes">To Add Inventory</option>
          <option value="No">Added Supplies</option>
        </select>
      </div>

      {/* Display Total Amount */}
      <div className="mb-6 text-center text-lg text-gray-200">
        <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.map(order => (
          <div 
            key={order._id} 
            className={`bg-gray-800 p-6 rounded-lg shadow-lg 
                        ${order.status === 'Yes' ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}
          >
            <img 
              src={`http://localhost:3001/Images/${order.image}`} 
              alt={order.name} 
              className="w-32 h-32 object-cover rounded-md"
            />
            <p><strong>ID:</strong> {order._id}</p>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Order Quantity:</strong> {order.orderQuantity}</p>
            <p><strong>Category:</strong> {order.category}</p>
            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
            <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
            <p><strong>Special Note:</strong> {order.specialNote}</p>
            <p><strong>Supplier ID:</strong> {order.supplierId}</p>
            <p><strong>Supplier Name:</strong> {order.supplierName}</p>
            <p><strong>Unit Price</strong> {order.totalAmount / order.orderQuantity}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>

            {/* Update Inventory Button */}
            <button 
              className={`px-4 py-2 mt-4 rounded 
                          ${order.status === 'Yes' ? 'bg-white text-black' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
              onClick={() => order.status === 'Yes' && handleUpdate(order.name, order.orderQuantity, order._id)}
              disabled={order.status !== 'Yes'} // Disable button if status is not 'Yes'
            >
              Update Inventory
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptedOrders;
