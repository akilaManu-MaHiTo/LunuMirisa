import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // NavLink for routing
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon for icons
import { faBars, faTimes, faUserShield, faUtensils, faBoxes, faTruck, faTable, faUserFriends, faCalendarCheck, faUser, faStar, faSpoon } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Handle sidebar state

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar
  };

  return (
    <>
      {/* Toggle Button */}
      <label className="absolute top-10 left-8 z-50">
        <div onClick={toggleSidebar} className="cursor-pointer">
          {!isOpen ? (
            <FontAwesomeIcon icon={faBars} className="text-3xl text-white" />
          ) : (
            <FontAwesomeIcon icon={faTimes} className="text-3xl text-gray-500" />
          )}
        </div>
      </label>

      {/* Sidebar Content */}
      <div className={`fixed left-0 top-0 h-full w-60 bg-white transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <header className="text-center mt-5 text-2xl font-bold p-4">Menu</header>
        <nav className="flex flex-col">
          <NavLink to="/AdminPage" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faUserShield} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Admin</span>
          </NavLink>

          <NavLink to="/AddMenuList" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faUtensils} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Menu List</span>
          </NavLink>

          <NavLink to="/ShowInventory" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faBoxes} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Inventory</span>
          </NavLink>

          <NavLink to="/SupplierManagerDashBoard" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faTruck} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Supplier Manager</span>
          </NavLink>

          <NavLink to="/AddTables" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faTable} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Add Tables</span>
          </NavLink>

          <NavLink to="/viewemployee" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faUserFriends} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Manage Employees</span>
          </NavLink>

          <NavLink to="/Reservations" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faCalendarCheck} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Manage Reservations</span>
          </NavLink>

          <NavLink to="/AllUsers" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">User Management</span>
          </NavLink>

          <NavLink to="/ShowAdminReviews" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faStar} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">Review Management</span>
          </NavLink>

          <NavLink to="/ShowAdminInOrder" activeClassName="border-l-4 border-[#980f0f] bg-black text-white" className="flex items-center h-16 px-6 text-[#353535] transition-colors duration-300 hover:border-l-4 hover:border-[#980f0f] hover:bg-black hover:text-white">
            <FontAwesomeIcon icon={faSpoon} className="mr-3 text-xl transition-transform duration-300 hover:scale-110" />
            <span className="text-xs uppercase tracking-widest">In Restuarent</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
