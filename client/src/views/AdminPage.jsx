import React from 'react';
import LineGraph from './Components/UserCartStat'; 
import BarGraph from './Components/InventoryStat';
import PriceGraph from './Components/CartPriceStat';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import Total from './Components/CalTotal';

const AdminPage = () => {

  return (
    <div className="bg-black h-auto min-h-screen">
      <Sidebar /> 

      <AdminNaviBar selectedPage="Admin Panel" />

      <div className="p-5 md:pl-[4rem]">
      </div>

      <div className="p-6">
        <div className="text-white mb-6">
          <h1 className="text-4xl font-bold text-center">Welcome to Admin</h1>
        </div>

        <Total/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-16">
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">
              Users vs Items (Line Graph)
            </h2>
            <LineGraph />
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">
              Inventory Stats (Bar Graph)
            </h2>
            <BarGraph />
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">
              Cart Price Stats (Price Graph)
            </h2>
            <PriceGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
