import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateSupplier() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [supplier, setSupplier] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    category: '',
  });

  const [error, setError] = useState(null);

  // Fetch supplier details to populate the form
  useEffect(() => {
    axios.get(`https://lunu-mirisa.vercel.app/ShowSupplierProfile/${id}`)
      .then(response => setSupplier(response.data))
      .catch(err => setError('Error fetching supplier details'));
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to update supplier
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`https://lunu-mirisa.vercel.app/UpdateSupplierProfile/${id}`, supplier)
      .then(() => {
        navigate('/ShowSupplierProfiles'); 
      })
      .catch(err => setError('Error updating supplier'));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Supplier</h2>
      
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={supplier.name}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={supplier.address}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="contact">Contact</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={supplier.contact}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={supplier.email}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={supplier.category}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Supplier
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateSupplier;
