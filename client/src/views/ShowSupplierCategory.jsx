import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function ShowSupplierCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('https://lunu-mirisa.vercel.app/ShowSupplierCategory')
      .then(result => setCategories(result.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://lunu-mirisa.vercel.app/DeleteSupplierCategory/${id}`)
      .then(() => {
        setCategories(categories.filter(category => category._id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <AdminNaviBar selectedPage="Supplier Categories" />
      <Sidebar/>
      <div className="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl mb-10">
        {/* Add Categories Button */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/AddSupplierCategory">
            <button className="bg-black text-white px-4 py-2 z-10 rounded-lg hover:bg-white hover:border hover:border-black hover:text-black transition duration-200 scale-105 ease-out">
              + Add Category
            </button>
          </Link>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r bg-black text-white text-sm font-medium">
                <th className="px-6 py-4 text-left">Category Name</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map(category => (
                <tr key={category._id} className=" hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{category.description}</td>
                  <td className="px-6 py-4 flex space-x-4">
                    <Link to={`/UpdateSupplierCategory/${category._id}`}>
                      <button className="text-white p-3 rounded-lg bg-blue-600 hover:text-black hover:bg-white hover:border hover:border-black mr-4 transition duration-200">
                        Update
                      </button>
                    </Link>
                    <button
                      className="text-white p-3 rounded-lg bg-red-600 hover:text-black hover:bg-white hover:border hover:border-black transition duration-200"
                      onClick={() => handleDelete(category._id)}
                    >
                     <FontAwesomeIcon icon={faTrashCan} className='mr-2' />  Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShowSupplierCategory;
