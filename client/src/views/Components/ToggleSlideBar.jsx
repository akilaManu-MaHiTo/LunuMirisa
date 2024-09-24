import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = React.forwardRef(({ isVisible }, ref) => {
  return (
    <aside
      ref={ref}
      className={`fixed pl-10 pr-10 pt-10 top-28 left-0 h-[calc(100%-4rem)] w-[30rem] bg-custom-gray shadow-md transform transition-transform duration-10000 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } z-50`}
    >
      <nav className="flex flex-col p-4">
      <Link to="/AdminPage">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            Admin
          </button>
        </Link>
        
        <Link to="/AddMenuList">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            Menu List
          </button>
        </Link>
        <Link to="/ShowInventory">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            Inventory
          </button>
        </Link>

        <Link to="/SupplierManagerDashBoard">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            Supplier Manager DashBoard
          </button>
        </Link>



        <Link to="/AddTables">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Tables
          </button>
        </Link>
        
        <Link to="/viewemployee">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            Manage Employees
          </button>
        </Link>

        <Link to="/Reservations">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            Manage Reservations
          </button>
        </Link>

        <Link to="/AllUsers">
          <button className="w-full text-left py-2 px-4 mb-6 bg-blue-500 text-white rounded hover:bg-blue-600">
            User Management
          </button>
        </Link>

        
      </nav>
    </aside>
  );
});

export default Sidebar;
