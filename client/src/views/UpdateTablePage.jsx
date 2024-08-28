import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function UpdateTable() {
  const { id } = useParams();
  const [tableNum, setTableNum] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/getTable/${id}`)
      .then(result => {
        setTableNum(result.data.tableNum);
        setQuantity(result.data.quantity);
        setPrice(result.data.price);
      })
      .catch(err => setError("Error fetching table data."));
  }, [id]);

  const updateTable = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/updateTable/${id}`, { tableNum, quantity, price })
      .then(result => {
        navigate('/Updatetable');
      })
      .catch(err => setError("Error updating table."));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <Link 
        to="/ShowTables" 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        My Tables
      </Link>
      <h2 className="text-2xl font-bold mb-6 text-center">Update Table Form</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={updateTable}>
        <div className="mb-4">
          <label className="block text-gray-700">Table Number:</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={tableNum}
            onChange={(e) => setTableNum(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity:</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
        >
          Update Table
        </button>
      </form>
    </div>
  );
}

export default UpdateTable;
