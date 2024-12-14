import React, { useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Images/Logo.png';

const NavigationBar = () => {
  const [showUserOption, setShowUserOption] = useState(false);

  const toggleUserOption = () => setShowUserOption(!showUserOption);

  return (
    <div className='custom1-md:pr-[10rem] custom1-md:pl-[10rem] bg-[#1A0E0E]'>
      <nav className="flex items-center justify-between px-4">
        <div className="flex items-center h-[7rem] w-32">
          <img src={logo} alt="Logo" className="h-auto w-20 " />
        </div>
        
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 self-center">
          <li><Link to={`/`} className="text-white font-spartan font-thin text-2xl ">Home</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin text-2xl select-none">&nbsp;|&nbsp;</li>
          <li><Link to={`/GuestMenu`} className="text-white font-spartan font-thin text-2xl">Menu</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin text-2xl select-none">&nbsp;|&nbsp;</li>
          <li><Link to="/AdminPage" className="text-white font-spartan font-thin text-2xl">About Us</Link></li>
        </ul>
        
        <div className="flex items-center space-x-4">
        <Link to="/login">
        <h4 className="text-white font-thin text-lg tracking-wide">Login / Signup</h4>
        </Link>
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
