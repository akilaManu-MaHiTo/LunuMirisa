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
    <div className="max-w-6xl mx-auto p-6">
      {/* Add Categories Button */}
      <div className="mb-6">
        <Link to="/AddSupplierCategory">
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            ADD CATEGORIES
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Category name</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td className="px-4 py-2 border-b">{category.name}</td>
              <td className="px-4 py-2 border-b">{category.description}</td>
              <td className="px-4 py-2 border-b">
                <Link to={`/UpdateSupplierCategory/${category._id}`}>
                  <button className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600">
                    Update
                  </button>
                </Link>
                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600" onClick={() => handleDelete(category._id)}>
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

export default ShowSupplierCategory;
