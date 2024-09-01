import React, { useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Images/Logo.png';

const NavigationBar = () => {
  const [showUserOption, setShowUserOption] = useState(false);

  const toggleUserOption = () => setShowUserOption(!showUserOption);

  return (
    <div className='custom1-md:pr-[10rem] custom1-md:pl-[10rem] bg-custom-gray'>
      <nav className="flex items-center justify-between px-4">
        <div className="flex items-center h-[7rem] w-32">
          <img src={logo} alt="Logo" className="h-auto w-20 " />
        </div>
        
        <div className="flex items-center space-x-4">
  <h4 className="text-white font-thin text-lg tracking-wide">Login / Signup</h4>

  <FontAwesomeIcon 
    icon={faUser} 
    className="text-white cursor-pointer text-2xl p-3 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300"
    onClick={toggleUserOption} 
  />
</div>

      </nav>
    </div>
  );
};

export default NavigationBar;
