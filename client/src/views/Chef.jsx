import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import logo from '../Images/Logo.png'; // Import your logo here

const CartInfoDisplay = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCartInfo = async () => {
      try {
        const response = await axios.get('https://lunu-mirisa.vercel.app/getCartInfo');
        setCartItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartInfo();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`https://lunu-mirisa.vercel.app/deleteOrder/${itemId}`);
      setCartItems(cartItems.filter((item) => item._id !== itemId));
      setMessageContent('Order deleted successfully!');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch (err) {
      setError('Failed to delete the order.');
      setMessageContent('Failed to delete the order.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handlePrint = (item) => {
    const orderDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'; // Corrected order date access

    // Map over cartItems to generate HTML for each item
    const cartItemsHtml = item.cartItems.map(cartItem => `
      <p>${cartItem.title} - Quantity: ${cartItem.quantity}</p>
    `).join(''); // Join to avoid commas between items

    // Bill content HTML
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
              <p><strong>Date:</strong> ${orderDate}</p>
            </div>
            <div class="bill-details">
              ${cartItemsHtml}
              <hr />
            </div>
            <div class="bill-footer">
              <p>Paid By: ${item.paymentMethod || 'N/A'}</p>
              <p>Order Id: ${item._id || 'N/A'}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Open a new window and print the content
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredCartItems = cartItems.filter((item) => {
    const itemDateString = new Date(item.createdAt).toISOString().split('T')[0];

    const searchDate = new Date(searchQuery);
    const isDateValid = !isNaN(searchDate.getTime());
    if (isDateValid) {
      const formattedSearchDate = searchDate.toISOString().split('T')[0];
      return itemDateString === formattedSearchDate;
    }

    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return <p className="text-white text-center">Loading cart information...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error fetching cart information: {error}</p>;
  }

  return (
    <div>
      <AdminNaviBar selectedPage="Chefs menu" />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">Order Information</h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name, email, or date (YYYY-MM-DD)..."
            className="mb-6 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCartItems.length > 0 ? (
              filteredCartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
                >
                  <p className="text-white mb-2"><strong>Name:</strong> {item.name}</p>
                  <p className="text-white mb-2"><strong>Address:</strong> {item.address}</p>
                  <p className="text-white mb-2"><strong>Email:</strong> {item.email}</p>
                  <p className="text-white mb-4"><strong>Payment Method:</strong> {item.paymentMethod}</p>
                  <p className="text-white mb-4"><strong>Submitted At:</strong> {new Date(item.createdAt).toLocaleString()}</p>

                  <h3 className="text-lg font-semibold text-white">Cart Items:</h3>
                  <ul className="list-disc pl-5 text-white">
                    {item.cartItems.map((cartItem) => (
                      <li key={cartItem._id}>
                        {cartItem.title} - Quantity: {cartItem.quantity}
                      </li>
                    ))}
                  </ul>

                  <div className="flex space-x-3 mt-auto">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                      onClick={() => handlePrint(item)}
                    >
                      Print Bill
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center col-span-full">No matching orders found.</p>
            )}
          </div>
        </div>
        {showMessage && (
          <div className="fixed top-0 right-0 mt-4 mr-4 bg-white text-black px-4 py-2 rounded shadow-lg">
            {messageContent}
          </div>
        )}
        <Link to='/CheffInventory'>
          <button className='bg-green-600 rounded-md hover:bg-green-800 p-2 mt-2 text-white'>
            Show Inventory
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartInfoDisplay;
