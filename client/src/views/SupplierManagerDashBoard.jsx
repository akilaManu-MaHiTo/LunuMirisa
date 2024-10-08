import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faList, faCheckCircle } from '@fortawesome/free-solid-svg-icons';



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


      <div className="flex justify-center grid-cols-1 md:grid-cols-3 gap-10">

          <div className=' justify-centerw-[40rem]  mt-32 bg-custom-toolight p-10 rounded-xl '>
            <h1 className="text-3xl font-thin text-center text-gray-800 mb-20">Supplier Manager Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div 
              onClick={() => handleNavigation('/ShowSupplierProfiles')} 
              className="bg-white border border-gray-200 hover:bg-black hover:text-white rounded-xl p-8 text-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Supplier Profiles
              </h2>
            </div>

            <div 
              onClick={() => handleNavigation('/ShowSupplierCategory')} 
              className="bg-white border border-gray-200 hover:bg-black hover:text-white rounded-xl p-8 text-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold">
                <FontAwesomeIcon icon={faList} className="mr-2" />
                Supplier Categories
              </h2>
            </div>

            <div 
              onClick={() => handleNavigation('/acceptedorders')} 
              className="bg-white border border-gray-200 hover:bg-black hover:text-white rounded-xl p-8 text-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Accepted Orders
              </h2>
            </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SupplierManagerDashBoard;
