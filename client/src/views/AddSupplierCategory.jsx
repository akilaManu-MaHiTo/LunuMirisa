import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddSupplierCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/AddSupplierCategory", { name, description })
      .then(() => navigate('/ShowSupplierCategory'))
      .catch(err => console.log(err));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium">Category Name:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium">Description:</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            rows="4"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white p-3 rounded-md mt-4 hover:bg-gradient-to-l transition duration-300 shadow-md hover:shadow-lg"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AddSupplierCategory;
