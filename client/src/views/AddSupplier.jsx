import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddSupplier() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [emailerror, setemailError] = useState("");

  useEffect(() => {
    axios.get("https://lunu-mirisa.vercel.app/ShowSupplierCategory")
      .then(response => setCategories(response.data))
      .catch(err => console.log(err));
  }, []);

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!validatePhoneNumber(contact)) {
      validationErrors.contact = 'Phone number must be exactly 10 digits';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    axios.post("https://lunu-mirisa.vercel.app/AddSupplier", { name, address, contact, email, category })
      .then(result => navigate('/ShowSupplierProfiles'))
      .catch(err => setemailError(err.response.data.message || "An error occurred during sign-up."));
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Create Supplier</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 mt-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input
            type="text"
            className="w-full px-4 py-3 mt-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Contact</label>
          <input
            type="text"
            className={`w-full px-4 py-3 mt-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 ${errors.contact ? 'border-red-500' : ''}`}
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength="10"
          />
          {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 mt-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailerror && <p className="text-red-500 text-sm mt-1">{emailerror}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Category</label>
          <select
            className="w-full px-4 py-3 mt-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Add Supplier
        </button>
      </form>
    </div>
  );
}

export default AddSupplier;
