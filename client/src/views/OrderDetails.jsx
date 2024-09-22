import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional for tables in PDF

const ShowWaitorOrders = () => {
  const { orderId, userId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchOrderItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/OrderItems/${orderId}`);
        setOrderItems(response.data);
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
    } catch (err) {
      setError('Error updating order status');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/DeleteOrderItem/${itemId}`);
      // Update orderItems state after deletion
      setOrderItems(orderItems.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Error deleting item');
    }
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Order Bill', 14, 16);

    const tableColumn = ['Category', 'Type', 'Price', 'Quantity', 'Total Price', 'Table Number'];
    const tableRows = orderItems.map((item) => [
      item.category,
      item.type,
      `$${item.price}`,
      item.quantity,
      `$${item.totalPrice}`,
      item.tableNum,
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 30 });

    const totalQuantity = orderItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = calculateTotalPrice();

    doc.setFontSize(12);
    doc.text(`Total Quantity: ${totalQuantity}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Price: $${totalPrice}`, 14, doc.autoTable.previous.finalY + 20);

    doc.save(`Order_${orderId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-600 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Order Items</h1>

      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow-md border border-gray-200">
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total Price:</strong> ${item.totalPrice}</p>
                <p><strong>Table Number:</strong> {item.tableNum}</p>
                <button 
                  onClick={() => handleDeleteItem(item._id)} 
                  className="mt-2 bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No items found for this order.</p>
          )}

          <div className="mt-4">
            <p className="text-white text-xl font-bold">Total Price: ${calculateTotalPrice()}</p>
          </div>

          <form onSubmit={handleStatusChange} className="mt-4">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mr-2 p-2">
              <option value="">Select Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Job Over">Job Over</option>
            </select>
            <button type="submit" className="bg-green-500 text-white p-2 rounded">Change Order Status</button>
          </form>

          <button onClick={generatePDF} className="mt-4 bg-blue-500 text-white p-2 rounded">Generate PDF Bill</button>

          {orderItems.length > 0 && (
            <Link to={`/InOrder/${orderId}/${userId}/${orderItems[0].tableNum}/${orderItems[0].date}/ongoing`}>
              <button className="mt-4 bg-gray-500 text-white p-2 rounded">Update Order</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowWaitorOrders;
