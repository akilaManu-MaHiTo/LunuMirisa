import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Images/Logo.png';

const AdminNavigationBar = ({ selectedPage }) => {
  return (
    <div className='custom1-md:pl-[3rem] bg-custom-maroon'>
      <nav className="flex items-center justify-start px-4 h-[7rem]">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-auto w-20 ml-20" />
        </div>
        <div className="flex-1 flex justify-center mr-52">
          <span className="text-4xl text-center font-thin text-white">{selectedPage}</span>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavigationBar;
