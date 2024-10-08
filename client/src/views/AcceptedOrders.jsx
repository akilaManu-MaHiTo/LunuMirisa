import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bgAdmin from '../Images/admin-bg.jpg';
import { faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

function AcceptedOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/acceptedOrders');
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let tempOrders = orders;

      if (categoryFilter) {
        tempOrders = tempOrders.filter(order => order.category === categoryFilter);
      }

      if (dateFilter) {
        tempOrders = tempOrders.filter(order => new Date(order.deliveryDate) <= new Date(dateFilter));
      }

      if (searchTerm) {
        tempOrders = tempOrders.filter(order =>
          order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredOrders(tempOrders);
    };

    applyFilters();
  }, [categoryFilter, dateFilter, searchTerm, orders]);

  const getDifference = (quantity, amount) => {
    return quantity - amount;
  };

  const isExpired = (deliveryDate) => {
    return new Date(deliveryDate) < new Date() ? 'Expired' : 'Not Expired';
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await fetch(`http://localhost:3001/acceptedOrders/${id}`, { method: 'DELETE' });
        setOrders(orders.filter(order => order._id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleUpdateClick = (order) => {
    setEditingOrder(order);
    setUpdatedOrder(order);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/acceptedOrders/${updatedOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });
      setOrders(orders.map(o => (o._id === updatedOrder._id ? updatedOrder : o)));
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const headers = [['Supplier Name', 'Order Quantity', 'Category', 'Amount', 'Delivery Date', 'Special Note', 'Difference', 'Expiry Status']];
    const rows = filteredOrders.map(order => [
      order.supplierName,
      order.orderQuantity,
      order.category,
      order.amount,
      new Date(order.deliveryDate).toLocaleDateString(),
      order.specialNote,
      getDifference(order.orderQuantity, order.amount),
      isExpired(order.deliveryDate),
    ]);

    doc.autoTable({
      head: headers,
      body: rows,
    });

    doc.save('accepted_orders_report.pdf');
  };

  // Calculate total price for all filtered orders
  const calculateTotalAmount = () => {
    return filteredOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
  };

  return (
    <div 
      style={{ 
        backgroundImage: `url(${bgAdmin})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
    }}
    >
      <AdminNaviBar selectedPage="Accepted Orders" />
      <Sidebar/>
      <div className="max-w-6xl mx-auto p-8 bg-custom-toolight rounded-lg shadow-xl my-10">

        {/* Total Price Display */}
        <div className="text-right  font-thin text-black my-6">
          <p className='text-xl mt-3'>Total Price:</p> <strong className='text-4xl'>Rs. {calculateTotalAmount()}</strong>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Supplier Name"
          className="mb-4 w-80 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="mb-4 w-40 p-3 border ml-5 border-gray-300 rounded-lg shadow-sm focus:outline-none transition"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Spices">Spices</option>
          <option value="Meat">Meat</option>
          <option value="Fisheries">Fisheries</option>
          <option value="Fruits">Fruits</option>
          <option value="Beverages">Beverages</option>
        </select>

        {/* Delivery Date Filter */}
        <input
          type="date"
          className="mb-4 w-40 p-3 ml-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none transition"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <button
          onClick={downloadPDF}
          className="mb-10 bg-blue-600 text-white ml-60 px-4 py-2 rounded-lg hover:bg-blue-400 hover:text-black transition"
        >
          Download PDF <FontAwesomeIcon icon={faDownload} className='ml-2' />
        </button>

        {/* Update Form */}

        {/* {editingOrder && (
          <form onSubmit={handleUpdateSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Order</h2>
            {['supplierName', 'orderQuantity', 'category', 'amount', 'deliveryDate', 'specialNote'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 mb-1 capitalize" htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type={field === 'deliveryDate' ? 'date' : field === 'orderQuantity' || field === 'amount' ? 'number' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={field === 'deliveryDate' ? updatedOrder.deliveryDate.split('T')[0] : updatedOrder[field]}
                  onChange={handleUpdateChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-500 transition"
                />
              </div>
            ))}
            <div className="flex justify-between">
              <button type="submit" className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">Update</button>
              <button type="button" onClick={() => setEditingOrder(null)} className="ml-4 bg-gray-300 p-3 rounded-lg hover:bg-gray-400 transition">Cancel</button>
            </div>
          </form>
        )} */}

        {/* Download Report Button */}


        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-green-100">
            <tr>
              {['Order Id', 'Supplier Name', 'Order Quantity', 'Category', 'Delivery Date', 'Special Note', 'Price', 'Expiry Status', 'Actions'].map(header => (
                <th key={header} className="border-b p-4 text-left text-gray-600">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="border-b p-4">{order._id}</td>
                <td className="border-b p-4">{order.supplierName}</td>
                <td className="border-b p-4">{order.orderQuantity}</td>
                <td className="border-b p-4">{order.category}</td>
                <td className="border-b p-4">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                <td className="border-b p-4">{order.specialNote}</td>
                <td className="border-b p-4">Rs. {order.totalAmount}</td>
                <td className="border-b p-4">{isExpired(order.deliveryDate)}</td>
                <td className="border-b p-4 space-x-2">
                  {/* <button
                    onClick={() => handleUpdateClick(order)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-400 hover:text-black transition"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AcceptedOrders;
