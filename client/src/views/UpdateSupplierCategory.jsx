import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateSupplierCategory() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://lunu-mirisa.vercel.app/getSupplierCategory/${id}`)
      .then(result => {
        setName(result.data.name);
        setDescription(result.data.description);
      })
      .catch(err => setError("Error fetching category data."));
  }, [id]);

  const updateCategory = (e) => {
    e.preventDefault();
    axios.put(`https://lunu-mirisa.vercel.app/updateSupplierCategory/${id}`, { name, description })
      .then(() => navigate('/ShowSupplierCategory'))
      .catch(err => setError("Error updating category."));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Supplier Category</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={updateCategory}>
        <div className="mb-4">
          <label className="block text-gray-700">Category name:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
        >
          Update Category
        </button>
      </form>
    </div>
  );
}

export default UpdateSupplierCategory;
