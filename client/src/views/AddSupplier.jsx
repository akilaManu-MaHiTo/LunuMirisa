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

  // Fetch categories when the component mounts
  useEffect(() => {
    axios.get("http://localhost:3001/ShowSupplierCategory")
      .then(response => {
        setCategories(response.data); // Set categories to state
        console.log(response);
      })
      .catch(err => console.log(err));
  }, []);

  // Validate phone number
  const validatePhoneNumber = (number) => {
    return /^\d{10}$/.test(number); 
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!validatePhoneNumber(contact)) {
      validationErrors.contact = 'Phone number must be exactly 10 digits';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission if there are errors
    }

    // Clear errors if validation passes
    setErrors({});

    // Submit the form data
   
    axios.post("http://localhost:3001/AddSupplier", { name:name, address:address, contact:contact, email:email, category:category })

      .then(result => {
        console.log(result);
        navigate('/ShowSupplierProfiles'); // Navigate to the supplier profiles page after successful addition
      })
      .catch(err =>{ 
				setemailError(err.response.data.message || "An error occurred during sign-up.");

      });
      
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">ADD SUPPLIER</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Address:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Contact:</label>
          <input
            type="text"
            className={`w-full p-2 border border-gray-300 rounded mt-1 ${errors.contact ? 'border-red-500' : ''}`}
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength="10" 
          />
          {errors.contact && <p className="text-red-600 text-sm">{errors.contact}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {emailerror && <div className="text-red-500 text-sm mb-4">{emailerror}</div>}
        <div className="mb-4">
          <label className="block text-gray-700">Category:</label>
          <select
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
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
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
        >
          ADD
        </button>
      </form>
    </div>
  );
}

export default AddSupplier;
