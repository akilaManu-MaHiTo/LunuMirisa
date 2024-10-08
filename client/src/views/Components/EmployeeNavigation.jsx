import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const NavigationBar = ({ logo, selectedPage }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showUserOption, setShowUserOption] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State for cart item count
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

  const toggleUserOption = () => {
    setShowUserOption(!showUserOption);
    if (showSearchBar) {
      setShowSearchBar(false);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/countCartItems/${userId}`)
      .then(response => {
        setCartItemCount(response.data.count); // Store the count in state
      })
      .catch(error => {
        console.error('Error fetching cart item count:', error);
      });
  }, [userId]); // Add userId as a dependency to re-fetch when it changes

  return (
    <div className='custom1-md:pr-[10rem] custom1-md:pl-[10rem] bg-custom-maroon'>
      <nav className="flex items-center justify-between px-4">
        <div className="flex items-center h-36 w-32">
          <img src={logo} alt="Logo" className="h-auto w-48 md:h-24 md:w-32" />
        </div>
        <div className="flex-1 flex justify-center ">
          <Link to={`/MunuListWaitor/${userId}`}>
            <span className="text-2xl text-center font-thin text-white hover:scale-110 transition-all duration-500 cursor-pointer">{selectedPage}</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon 
            icon={faUser} 
            className="text-white cursor-pointer text-2xl p-3 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300"
            onClick={toggleUserOption} 
            aria-label="User Options"
          />
        </div>

        {showUserOption && (
          <div 
            ref={userRef} 
            className="absolute top-10 right-20 mt-14 p-4 rounded-lg bg-custom-dark shadow-lg border border-white transform transition-transform duration-300 ease-in-out scale-95 translate-y-[-10px] z-50"
          >
            <ul className="space-y-2">
              <li>
                <Link to={`/profile/${userId}`}>
                  <button className="w-full text-white text-left font-semibold hover:bg-white hover:text-black py-2 px-3 rounded-md transition-colors duration-300 flex items-center">
                    <FontAwesomeIcon icon={faUserCog} className="mr-2" />
                    My Profile
                  </button>
                </Link>
              </li>
              <li>
                <Link to={`/Login`}>
                  <button className="w-full text-red-500 font-semibold hover:bg-red-500 hover:text-black py-2 px-3 rounded-md transition-colors duration-300 flex items-center">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavigationBar;
