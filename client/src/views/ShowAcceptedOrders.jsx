import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AcceptedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from the server
    axios.get('http://localhost:3001/acceptedOrders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(err => {
        setError('Failed to fetch orders');
        console.error(err);
      });
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 text-gray-100 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-200">Accepted Orders</h1>
      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <img 
                      src={`http://localhost:3001/Images/` + order.image} 
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
            <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
            <button className='bg-white text-black'>Update Inventory</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptedOrders;
