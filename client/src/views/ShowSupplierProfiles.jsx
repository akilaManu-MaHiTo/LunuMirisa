import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ShowSupplierProfiles() {
  const [suppliers, setSuppliers] = useState([]);

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
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Supplier Profiles</h2>

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
          {suppliers.map(supplier => (
            <tr key={supplier._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contact}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleDelete(supplier._id)}
                  className="text-red-600 hover:text-red-900"
                >
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

export default ShowSupplierProfiles;
