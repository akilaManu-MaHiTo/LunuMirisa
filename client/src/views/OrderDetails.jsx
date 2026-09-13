import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgtable from '../Images/suppliar-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png'; // Update the path according to your project structure

const ShowWaitorOrders = () => {
  const { orderId, userId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  // Grouping items by title
  const groupItemsByTitle = (items) => {
    const groupedItems = {};
    items.forEach((item) => {
      if (groupedItems[item.title]) {
        groupedItems[item.title].quantity += item.quantity;
        groupedItems[item.title].totalPrice += item.totalPrice;
      } else {
        groupedItems[item.title] = { ...item };
      }
    });
    return Object.values(groupedItems);
  };

  useEffect(() => {
    const fetchOrderItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://lunu-mirisa.vercel.app/OrderItems/${orderId}`);
        const groupedData = groupItemsByTitle(response.data); // Group the items by title
        setOrderItems(groupedData);
      } catch (err) {
        setError('Error fetching order items');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://lunu-mirisa.vercel.app/UpdateStatus/${orderId}`, { status });
      console.log('Status updated');
    } catch (err) {
      setError('Error updating order status');
    }
  };

  const handleUpdateQuantity = async (e, itemId) => {
    const newQuantity = e.target.value;
    try {
      await axios.put(`https://lunu-mirisa.vercel.app/UpdateQuentity/${itemId}`, { quantity: newQuantity });
      setOrderItems(orderItems.map(item => item._id === itemId ? { ...item, quantity: newQuantity } : item));
    } catch (err) {
      setError('Error updating order quantity');
    }
  };

  const handleDeleteItem = async (itemId) => {
    setLoading(true);  // Show loader when deletion starts
    try {
      await axios.delete(`https://lunu-mirisa.vercel.app/DeleteOrderItem/${itemId}`);
      setOrderItems(orderItems.filter(item => item._id !== itemId));
      window.location.reload();  // Refresh the page
    } catch (err) {
      setError('Error deleting item');
      console.log(err);
    } finally {
      setLoading(false); // Hide loader when deletion completes or fails
    }
  };
  

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
  };

  const calculateTotalQuantity = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  // PDF generation with grouped item

  const handlePrint = () => {
    const orderDate = orderItems.length > 0 ? new Date(orderItems[0].date).toLocaleDateString() : 'N/A'; // Format the date
    const totalPrice = calculateTotalPrice();
    const formattedTotalPrice = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00';
  
    const billContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Courier', monospace;
              color: #000;
            }
            .bill-container {
              width: 300px;
              margin: auto;
              text-align: center;
            }
            .header-logo {
              width: 100px;
              filter: grayscale(100%);
            }
            .bill-header {
              font-size: 20px;
              font-weight: bold;
            }
            .bill-details, .bill-footer {
              font-size: 16px;
              margin: 15px 0;
            }
            hr {
              border: none;
              border-top: 1px dashed #000;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <img src="${logo}" alt="Logo" class="header-logo" />
            <div class="bill-header">LunuMirisa Restaurant</div>
            <div class="bill-details">
              <p>Lunumirisa, Boralasgamuwa, Colombo, Sri Lanka</p>
              <p>Tel: 0766670918</p>
            </div>
            <div class="bill-details">
              <p><strong>Date:</strong> ${orderDate}</p> <!-- Add the date here -->
              ${
                orderItems && orderItems.length > 0
                  ? orderItems.map(orderItem => `<p>${orderItem.title} - ${orderItem.quantity} - Rs. ${orderItem.totalPrice.toFixed(2)}</p>`).join('')
                  : '<p>No items in the order.</p>'
              }
              <hr />
              <p><strong>Total: Rs. ${calculateTotalPrice()}</strong></p>
            </div>
            <div class="bill-footer">
              <p>Order Id: ${orderId}</p>
              <p>Thank You Come Again!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  };
  
  return (
    <div>
      <AdminNaviBar selectedPage="Order Items" />
      <Sidebar />  
      <div className="flex flex-col items-center min-h-screen bg-gray-900 p-6"
                      style={{ 
                        backgroundImage: `url(${bgtable})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center'
                    }}
      >
        <div></div>
        {loading && <div className="text-white">Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {!loading && !error && (
          <div className="w-full max-w-3xl">
            {orderItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={`https://lunu-mirisa.vercel.app/Images/` + item.image}
                        alt={item.name}
                        className="w-32 h-32 rounded-md mr-4"
                      />
                      <div>
                        <p className="text-lg font-semibold text-white mb-1"><strong>Category:</strong> {item.category}</p>
                        <p className="text-gray-400"><strong>Type:</strong> {item.title}</p>
                        <p className="text-gray-400"><strong>Price:</strong> Rs. {item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white">Quantity:</label>
                        <input
                          type="number"
                          value={item.quantity}
                          readOnly
                          onChange={(e) => handleUpdateQuantity(e, item._id)}
                          className="ml-2 pl-5 py-2 w-16 text-white bg-gray-700 border border-gray-600 rounded"
                        />
                      </div>
                      <p className="text-gray-300"><strong>Total Price:</strong> Rs. {item.totalPrice}</p>
                    </div>

                    <p className="mt-2 text-gray-400"><strong>Table Number:</strong> {item.tableNum}</p>

                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete Item
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No items found for this order.</p>
            )}

            <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
              <p className="text-2xl font-semibold text-white">Total Price: Rs.{calculateTotalPrice()}</p>
              <p className="text-xl text-gray-400">Total Quantity: {calculateTotalQuantity()}</p>
            </div>

            <form onSubmit={handleStatusChange} className="mt-6 flex items-center">
              <div className='flex gap-10'>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="p-3 bg-gray-700 border border-gray-600 rounded text-gray-100 mr-4"
                >
                  <option value="">Select Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Job Over">Job Over</option>
                </select>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-white text-white hover:text-black py-2 px-4 rounded transition-all hover:scale-105 duration-500"
                >
                  Change Order Status
                </button>

                <button
                  onClick={handlePrint
                  }
                  className=" bg-blue-500 hover:bg-white text-white hover:text-black py-2 px-4 rounded transition-all hover:scale-105 duration-500"
                >
                  Download PDF Bill <FontAwesomeIcon icon={faDownload} className='mr-2' />
                </button>

                {orderItems.length > 0 && (
                  <Link to={`/InOrder/${orderId}/${userId}/${orderItems[0].tableNum}/${orderItems[0].date}/ongoing`}>
                    <button className=" bg-black border border-white hover:bg-white text-white hover:text-black py-2 px-4 rounded transition-all hover:scale-105 duration-500">
                      Update Order
                    </button>
                  </Link>
                )}
              </div>

            </form>


          </div>
        )}
      </div>
    </div>
  );
};

export default ShowWaitorOrders;
