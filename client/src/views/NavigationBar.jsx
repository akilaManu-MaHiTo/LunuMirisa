import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

const NavigationBar = ({ logo }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showUserOption, setShowUserOption] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const { userId } = useParams(); // Extract userId from URL

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
    <div className='custom1-md:pr-[10rem] custom1-md:pl-[10rem] bg-custom-gray'>
      <nav className="flex items-center justify-between px-4">
        <div className="flex items-center h-36 w-32">
          <img src={logo} alt="Logo" className="h-auto w-48 md:h-24 md:w-32" />
        </div>

        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 self-center">
          <li><Link to="/" className="text-white font-spartan font-thin text-2xl ">Home</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin text-2xl">&nbsp;|&nbsp;</li>
          <li><Link to="/showMenuList" className="text-white font-spartan font-thin text-2xl">Menu</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin text-2xl">&nbsp;|&nbsp;</li>
          <li><Link to="/" className="text-white font-spartan font-thin text-2xl">Offers</Link></li>
        </ul>
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon icon={faSearch} className="text-white cursor-pointer hidden md:inline text-2xl p-3" onClick={toggleSearchBar} />
          <FontAwesomeIcon icon={faShoppingCart} className="text-white cursor-pointer hidden md:inline text-2xl p-3" />
          <FontAwesomeIcon icon={faUser} className="text-white cursor-pointer text-2xl p-3" onClick={toggleUserOption} />
        </div>
        {showSearchBar && (
          <div ref={searchRef} className="absolute top-0.5 right-60 mt-2 mr-4 p-2 rounded-md shadow-lg hidden md:inline h-15.5" style={{ maxWidth: '600px' }}>
            <input type="text" placeholder="Search..." className=" text-white px-3 py-1 border border-black focus:outline-none focus:border-black w-full md:max-w-96 bg-gray-700" />
          </div>
        )}

        {showUserOption && (
          <div ref={userRef} className="absolute top-10 right-16 mt-2 mr-4 p-2 rounded-none bg-gray-800">
            <ul>
              <Link to={`/UserProfile/${userId}`}><button>Profile Settings</button></Link>
              <li className='text-red-800'>Logout</li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavigationBar;
