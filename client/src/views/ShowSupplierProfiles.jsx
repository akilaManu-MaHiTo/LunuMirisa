import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faList, faCheckCircle, faPlus, faSearch, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function ShowSupplierProfiles() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/ShowSupplierProfiles")
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(err => console.error('Error fetching suppliers:', err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/DeleteSupplierProfile/${id}`)
      .then(() => {
        setSuppliers(suppliers.filter(supplier => supplier._id !== id));
      })
      .catch(err => console.error('Error deleting supplier:', err));
  };

  const handleUpdate = (id) => {
    navigate(`/UpdateSupplier/${id}`);
  };

  const categories = ['All', 'Vegetables', 'Spices', 'Meat', 'Fisheries', 'Fruits', 'Beverages'];

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
    <div>
      <AdminNaviBar selectedPage="Supplier Profile" />
      <Sidebar/>
      <div className="w-full h-screen mx-auto bg-custom-toolight p-8 border border-gray-300 rounded-lg shadow-lg">

        <div className='flex gap-10 w-full justify-between my-10'>


          <div className="mb-6">

            <div className='flex items-center'>
            <FontAwesomeIcon icon={faSearch} className='text-white text-lg items-center  mr-2 bg-black p-2 rounded-xl' />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm "
            />
            </div>

          </div>

          <div className="mb-6">
          <label htmlFor="categoryFilter" className="mr-2 font-medium">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-200"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className=" justify-end mb-6">
            <button
              onClick={handleAddSupplier}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:border hover:border-black hover:text-black transition duration-200 scale-105 ease-out"
            >
              <FontAwesomeIcon icon={faPlus} /> Add Supplier
            </button>
          </div>

        </div>



        <table className="w-full divide-y divide-gray-200 rounded-xl mx-auto mt-16">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
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
                    <div className='flex'>
                      <button
                        onClick={() => handleUpdate(supplier._id)}
                        className="text-white p-3 rounded-lg bg-blue-600 hover:text-black hover:bg-white hover:border hover:border-black mr-4 transition duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="text-white p-3 rounded-lg bg-red-600 hover:text-black hover:bg-white hover:border hover:border-black transition duration-200"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className='mr-2' />  Delete
                      </button>
                    </div>
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
    </div>
  );
}

export default ShowSupplierProfiles;
