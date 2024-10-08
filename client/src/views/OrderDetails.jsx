import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional for tables in PDF

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
        const response = await axios.get(`http://localhost:3001/OrderItems/${orderId}`);
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
      await axios.put(`http://localhost:3001/UpdateStatus/${orderId}`, { status });
      console.log('Status updated');
    } catch (err) {
      setError('Error updating order status');
    }
  };

  const handleUpdateQuantity = async (e, itemId) => {
    const newQuantity = e.target.value;
    try {
      await axios.put(`http://localhost:3001/UpdateQuentity/${itemId}`, { quantity: newQuantity });
      setOrderItems(orderItems.map(item => item._id === itemId ? { ...item, quantity: newQuantity } : item));
    } catch (err) {
      setError('Error updating order quantity');
    }
  };

  const handleDeleteItem = async (itemId) => {
    setLoading(true);  // Show loader when deletion starts
    try {
      await axios.delete(`http://localhost:3001/DeleteOrderItem/${itemId}`);
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

  // PDF generation with grouped items
  const generatePDF = () => {
    if (orderItems.length === 0) return alert('No order items to generate PDF');

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text('LunuMirisa Restaurant', 14, 16);
    doc.setFontSize(14);
    doc.text(`Bill Date: ${today}`, 14, 26);

    const tableColumn = ['Category', 'Type', 'Price', 'Quantity', 'Total Price', 'Table Number'];
    const tableRows = orderItems.map((item) => [
      item.category,
      item.type,
      `$${item.price}`,
      item.quantity,
      `$${item.totalPrice}`,
      item.tableNum,
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 40 });

    const totalQuantity = calculateTotalQuantity();
    const totalPrice = calculateTotalPrice();

    doc.setFontSize(12);
    doc.text(`Total Quantity: ${totalQuantity}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Price: $${totalPrice}`, 14, doc.autoTable.previous.finalY + 20);

    doc.save(`Order_${orderId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Order Items - LunuMirisa</h1>

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
                      src={`http://localhost:3001/Images/` + item.image}
                      alt={item.name}
                      className="w-32 h-32 rounded-md mr-4"
                    />
                    <div>
                      <p className="text-lg font-semibold text-white mb-1"><strong>Category:</strong> {item.category}</p>
                      <p className="text-gray-400"><strong>Type:</strong> {item.title}</p>
                      <p className="text-gray-400"><strong>Price:</strong> ${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-gray-300">Quantity:</label>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        onChange={(e) => handleUpdateQuantity(e, item._id)}
                        className="ml-2 p-1 w-16 bg-gray-700 border border-gray-600 rounded"
                      />
                    </div>
                    <p className="text-gray-300"><strong>Total Price:</strong> ${item.totalPrice}</p>
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
            <p className="text-2xl font-semibold text-white">Total Price: ${calculateTotalPrice()}</p>
            <p className="text-xl text-gray-400">Total Quantity: {calculateTotalQuantity()}</p>
          </div>

          <form onSubmit={handleStatusChange} className="mt-6 flex items-center">
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
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
            >
              Change Order Status
            </button>
          </form>

          <button
            onClick={generatePDF}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            Generate PDF Bill
          </button>

          {orderItems.length > 0 && (
            <Link to={`/InOrder/${orderId}/${userId}/${orderItems[0].tableNum}/${orderItems[0].date}/ongoing`}>
              <button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors">
                Update Order
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowWaitorOrders;
