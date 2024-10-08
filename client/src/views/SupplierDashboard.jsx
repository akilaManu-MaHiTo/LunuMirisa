import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './Components/NavigationBar.jsx'; 

function SupplierDashboard() {
  const { supplierId } = useParams();
  const [supplierData, setSupplierData] = useState(null);
  const [orderRequests, setOrderRequests] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [showOrderRequests, setShowOrderRequests] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const navigate = useNavigate();
  const declinedOrders = JSON.parse(localStorage.getItem(`declinedOrders_${supplierId}`)) || [];
  const displayOrderCount = orderCount - declinedOrders.length;

  useEffect(() => {
    axios.get(`http://localhost:3001/ShowSupplierProfile/${supplierId}`)
      .then(response => {
        setSupplierData(response.data);
        return axios.get(`http://localhost:3001/orders/${response.data.category}`);
      })
      .then(res => setOrderRequests(res.data))
      .catch(err => console.error("Error fetching data:", err));
  }, [supplierId]);

  useEffect(() => {
    if (supplierData) {
      axios.get(`http://localhost:3001/acceptedOrders/${supplierData._id}`)
        .then(response => setAcceptedOrders(response.data))
        .catch(err => console.error("Error fetching accepted orders:", err));

      axios.get(`http://localhost:3001/countByCategory/${supplierData.category}`)
        .then(response => {
          setOrderCount(response.data.length > 0 ? response.data[0].count : 0);
        })
        .catch(err => console.error("Error fetching count:", err));
    }
  }, [supplierData]);

  const handleDecline = (orderId) => {
    const declinedOrders = JSON.parse(localStorage.getItem(`declinedOrders_${supplierId}`)) || [];
    const updatedDeclinedOrders = [...declinedOrders, orderId];
    localStorage.setItem(`declinedOrders_${supplierId}`, JSON.stringify(updatedDeclinedOrders));
    setOrderRequests(orderRequests.filter(order => order._id !== orderId));
  };

  const filteredAcceptedOrders = acceptedOrders.filter(order =>
    (!filterDate || new Date(order.deliveryDate).toISOString().split('T')[0] === filterDate) &&
    order.orderQuantity > 0
  );

  return (
   <div>
      



    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12 dark:bg-gray-900 transition-colors duration-500">
      <h1 className="text-5xl font-extrabold text-center text-gray-100 mb-12 dark:text-gray-300">Supplier Dashboard</h1>

      {supplierData ? (
        <div className="flex flex-col items-center space-y-12">
          {/* Supplier Profile Section */}
          <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-4xl">
            <h2 className="text-3xl font-semibold text-indigo-400 mb-8 text-center">Supplier Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <p><strong>Name:</strong> {supplierData.name}</p>
              <p><strong>Email:</strong> {supplierData.email}</p>
              <p><strong>Address:</strong> {supplierData.address}</p>
              <p><strong>Category:</strong> {supplierData.category}</p>
            </div>
            <div className="flex justify-between mt-8">
              {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Reset Password
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300">
                Log Out
              </button> */}
            </div>
          </div>

          {/* Manage Orders Section */}
          <div className="w-full max-w-4xl">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 flex justify-around items-center">
              <button
                className={`py-3 px-8 rounded-lg font-semibold transition-colors duration-300 
                ${!showOrderRequests ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'}`}
                onClick={() => setShowOrderRequests(false)}
              >
                Accepted Orders
              </button>
              <button
                className={`py-3 px-8 rounded-lg font-semibold transition-colors duration-300 
                ${showOrderRequests ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'}`}
                onClick={() => setShowOrderRequests(true)}
              >
                Order Requests {displayOrderCount}
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-4xl">
            {showOrderRequests ? (
              <div>
                <h2 className="text-2xl font-semibold text-green-500 mb-8 text-center">Order Requests</h2>
                {orderRequests.length > 0 ? (
                  orderRequests
                    .filter(order => {
                      const declinedOrders = JSON.parse(localStorage.getItem(`declinedOrders_${supplierId}`)) || [];
                      return !declinedOrders.includes(order._id) && order.orderQuantity > 0;
                    })
                    .map(order => (
                      <div key={order._id} className="p-6 mb-6 border-b border-gray-600">
                        <img src={`http://localhost:3001/Images/${order.image}`} alt="Order Image" className='w-20 h-20 rounded' />
                        <h3 className="text-xl font-bold mb-2 text-gray-200">{order.name}</h3>
                        <p className="text-gray-400">Order Quantity: {order.orderQuantity}</p>
                        <p className="text-gray-400">Category: {order.category}</p>
                        <div className="flex justify-end mt-4 space-x-4">
                          <Link to={`/SupplierConfirmOrder/${supplierData._id}/${order._id}/${supplierData.name}/${order.image}`}>
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
                            >
                              Accept
                            </button>
                          </Link>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
                            onClick={() => handleDecline(order._id)}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center">No order requests available.</p>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-indigo-400 mb-8 text-center">Accepted Orders</h2>
                <input
                  type="date"
                  className="mb-4 p-3 border rounded-lg w-full max-w-xs bg-gray-800 text-gray-100 border-gray-600"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                {filteredAcceptedOrders.length > 0 ? (
                  <table className="w-full border-collapse bg-gray-800 text-gray-200">
                    <thead>
                      <tr className="bg-gray-700 text-gray-300">
                        <th className="border border-gray-600 p-3 text-left">Order Id</th>
                        <th className="border border-gray-600 p-3 text-left">Name</th>
                        <th className="border border-gray-600 p-3 text-left">Order Quantity</th>
                        <th className="border border-gray-600 p-3 text-left">Category</th>
                        <th className="border border-gray-600 p-3 text-left">Amount</th>
                        <th className="border border-gray-600 p-3 text-left">Delivery Date</th>
                        <th className="border border-gray-600 p-3 text-left">Special Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAcceptedOrders.map(order => (
                        <tr key={order._id} className="hover:bg-gray-700 transition duration-300">
                          <td className="border border-gray-600 p-3">{order._id}</td>
                          <td className="border border-gray-600 p-3">{order.name}</td>
                          <td className="border border-gray-600 p-3">{order.orderQuantity}</td>
                          <td className="border border-gray-600 p-3">{order.category}</td>
                          <td className="border border-gray-600 p-3">{order.totalAmount}</td>
                          <td className="border border-gray-600 p-3">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                          <td className="border border-gray-600 p-3">{order.specialNote || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center">No accepted orders available for the selected date.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading supplier information...</p>
      )}
    </div>
    </div>
  );
}

export default SupplierDashboard;
