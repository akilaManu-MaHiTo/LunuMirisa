import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';

function SupplierManagerDashBoard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <AdminNaviBar selectedPage="Supplier Manager Dashboard" />
      <Sidebar />   

      <div className="w-full h-screen rounded-lg"
          style={{ 
            backgroundImage: `url(${bgAdmin})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
          }}
      >


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
    </div>
  );
}

export default SupplierManagerDashBoard;
