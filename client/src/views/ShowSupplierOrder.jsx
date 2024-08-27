import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ShowSupplier() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/ShowSupplierOrder')
      .then(result => setOrders(result.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/deleteSupplierOrder/${id}`)
      .then(() => {
        // Remove the deleted order from the state
        setOrders(orders.filter(order => order._id !== id));
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Supplier Orders</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Amount (KG)</th>
            <th className="px-4 py-2 border-b">Price (Rs)</th>
            <th className="px-4 py-2 border-b">Date of Delivery</th>
            <th className="px-4 py-2 border-b">Special Note</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="px-4 py-2 border-b">{order.amount}</td>
              <td className="px-4 py-2 border-b">{order.price}</td>
              <td className="px-4 py-2 border-b">{order.deliveryDate}</td>
              <td className="px-4 py-2 border-b">{order.specialNote}</td>
              <td className="px-4 py-2 border-b">
                <Link to={`/UpdateSupplierOrder/${order._id}`}>
                  <button className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600">
                    Update
                  </button>
                </Link>
                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600" onClick={() => handleDelete(order._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowSupplier;
