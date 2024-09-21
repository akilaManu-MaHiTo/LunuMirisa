import React from 'react';
import { useNavigate } from 'react-router-dom';

function SupplierManagerDashBoard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 p-12 rounded-lg shadow-lg">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-12">Supplier Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div 
          onClick={() => handleNavigation('/ShowSupplierProfiles')} 
          className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-br from-blue-500 to-indigo-600 text-center cursor-pointer transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-gray-700">Supplier Profiles</h2>
        </div>

        <div 
          onClick={() => handleNavigation('/ShowSupplierCategory')} 
          className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-br from-green-500 to-teal-600 text-center cursor-pointer transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-gray-700">Supplier Categories</h2>
        </div>

        <div 
          onClick={() => handleNavigation('/acceptedorders')} 
          className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-br from-yellow-500 to-orange-600 text-center cursor-pointer transition-transform transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-gray-700">Accepted Orders</h2>
        </div>
      </div>
    </div>
  );
}

export default SupplierManagerDashBoard;
