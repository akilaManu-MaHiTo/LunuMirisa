import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function ShowSupplierProfiles() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const navigate = useNavigate(); 

  // Fetch all suppliers when the component mounts
  useEffect(() => {
    axios.get("http://localhost:3001/ShowSupplierProfiles")
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(err => console.error('Error fetching suppliers:', err));
  }, []);

  // Handle supplier deletion
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/DeleteSupplierProfile/${id}`)
      .then(() => {
        // Remove the deleted supplier from the state
        setSuppliers(suppliers.filter(supplier => supplier._id !== id));
      })
      .catch(err => console.error('Error deleting supplier:', err));
  };

  // Navigate to the update page
  const handleUpdate = (id) => {
    navigate(`/UpdateSupplier/${id}`); 
  };

  // Get unique categories from the supplier list for the filter dropdown
  const categories = ['All', ...new Set(suppliers.map(supplier => supplier.category))];

  // Filter the suppliers based on the search query and selected category
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSupplier = () => {
    navigate('/AddSupplier'); 
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Supplier Profiles</h2>

      <div className="mb-6 text-right">
        <button
          onClick={handleAddSupplier}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Supplier
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="categoryFilter" className="mr-2 font-medium">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map(supplier => (
              <tr key={supplier._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleUpdate(supplier._id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(supplier._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No suppliers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShowSupplierProfiles;
