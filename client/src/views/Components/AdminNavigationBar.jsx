import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Images/Logo.png';

const AdminNavigationBar = ({ selectedPage }) => {
  return (
    <div className='custom1-md:pl-[3rem] bg-custom-gray'>
      <nav className="flex items-center justify-start px-4 h-[7rem]">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-auto w-20" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-bold text-white">{selectedPage}</span>
        </div>
        <div className="flex items-center">
          {/* Other navigation items can go here */}
        </div>
      </nav>
    </div>
  );
};

export default AdminNavigationBar;