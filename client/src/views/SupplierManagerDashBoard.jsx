import React from 'react';
import { useNavigate } from 'react-router-dom'; 

function SupplierManagerDashBoard() {
  const navigate = useNavigate();

  
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Supplier Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => handleNavigation('/ShowSupplierProfiles')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Supplier Profiles
        </button>
        
        <button
          onClick={() => handleNavigation('/ShowSupplierCategory')}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Supplier Categories
        </button>
        
        <button
          onClick={() => handleNavigation('/myprofile')}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          My Profile
        </button>
        
        <button
          onClick={() => handleNavigation('/acceptedorders')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Accepted Orders
        </button>
      </div>
    </div>
  );
}

export default SupplierManagerDashBoard;
