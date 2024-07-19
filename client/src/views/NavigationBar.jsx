import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = ({ logo }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showUserOption, setShowUserOption] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchBar(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserOption(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (showUserOption) {
      setShowUserOption(false);
    }
  };

  const toggleUserOption = () => {
    setShowUserOption(!showUserOption);
    if (showSearchBar) {
      setShowSearchBar(false);
    }
  };

  return (
    <div>
      <nav className="bg-custom-black flex items-center justify-between px-4">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-20 md:h-16 md:w-16" />
        </div>
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 self-center">
          <li><Link to="/" className="text-white font-spartan font-thin">Home</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin">&nbsp;|&nbsp;</li>
          <li><Link to="/" className="text-white font-spartan font-thin">Menu</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin">&nbsp;|&nbsp;</li>
          <li><Link to="/" className="text-white font-spartan font-thin">Offers</Link></li>
        </ul>
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon icon={faSearch} className="text-white cursor-pointer hidden md:inline" onClick={toggleSearchBar} />
          <FontAwesomeIcon icon={faShoppingCart} className="text-white cursor-pointer hidden md:inline" />
          <FontAwesomeIcon icon={faUser} className="text-white cursor-pointer" onClick={toggleUserOption} />
        </div>
        {showSearchBar && (
          <div ref={searchRef} className="absolute top-0.5 right-60 mt-2 mr-4 p-2 rounded-md shadow-lg hidden md:inline h-15.5" style={{ maxWidth: '600px' }}>
            <input type="text" placeholder="Search..." className=" text-white px-3 py-1 border border-black focus:outline-none focus:border-black w-full md:max-w-96 bg-gray-700" />
          </div>
        )}

        {showUserOption && (
          <div ref={userRef} className="absolute top-10 right-16 mt-2 mr-4 p-2 rounded-none bg-gray-800">
            <ul>
              <li className='text-white'>User Profile</li>
              <li className='text-red-800'>Logout</li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavigationBar;
