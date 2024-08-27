import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function UpdateSupplier() {
  const { id } = useParams();
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/getSupplierOrder/${id}`)
      .then(result => {
        setAmount(result.data.amount);
        setPrice(result.data.price);
        setDeliveryDate(result.data.deliveryDate);
        setSpecialNote(result.data.specialNote);
      })
      .catch(err => setError("Error fetching order data."));
  }, [id]);

  const updateOrder = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/updateSupplierOrder/${id}`, { amount, price, deliveryDate, specialNote })
      .then(result => {
        navigate('/ShowSupplierOrder');
      })
      .catch(err => setError("Error updating order."));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <Link 
        to="/ShowSupplierOrder" 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        My Orders
      </Link>
      <h2 className="text-2xl font-bold mb-6 text-center">Update Ingredient Order Form</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={updateOrder}>
        <div className="mb-4">
          <label className="block text-gray-700">Amount (KG):</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price (Rs):</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Delivery:</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Special Note (optional):</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateSupplier;
