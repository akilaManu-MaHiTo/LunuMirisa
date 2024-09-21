import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ShowSupplierCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/ShowSupplierCategory')
      .then(result => setCategories(result.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/DeleteSupplierCategory/${id}`)
      .then(() => {
        setCategories(categories.filter(category => category._id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      {/* Add Categories Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Supplier Categories</h1>
        <Link to="/AddSupplierCategory">
          <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300">
            + Add Category
          </button>
        </Link>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-medium">
              <th className="px-6 py-4 text-left">Category Name</th>
              <th className="px-6 py-4 text-left">Description</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category._id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{category.description}</td>
                <td className="px-6 py-4 flex space-x-4">
                  <Link to={`/UpdateSupplierCategory/${category._id}`}>
                    <button className="px-4 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition duration-200">
                      Update
                    </button>
                  </Link>
                  <button
                    className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition duration-200"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
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

export default ShowSupplierCategory;
