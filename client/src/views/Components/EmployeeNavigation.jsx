import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const NavigationBar = ({ logo }) => {
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
    <div className='custom1-md:pr-[10rem] custom1-md:pl-[10rem] bg-custom-gray'>
      <nav className="flex items-center justify-between px-4">
        <div className="flex items-center h-36 w-32">
          <img src={logo} alt="Logo" className="h-auto w-48 md:h-24 md:w-32" />
        </div>

        {/* <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 self-center">
          <li><Link to="/" className="text-white font-spartan font-thin text-2xl ">Home</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin text-2xl">&nbsp;|&nbsp;</li>
          <li><Link to={`/ShowMenuList/${userId}`} className="text-white font-spartan font-thin text-2xl">Menu</Link></li>
          <li className="text-white hidden md:inline font-spartan font-thin text-2xl">&nbsp;|&nbsp;</li>
          <li><Link to="/" className="text-white font-spartan font-thin text-2xl">Offers</Link></li>
        </ul> */}
        
        <div className="flex items-center space-x-4">

          <FontAwesomeIcon 
            icon={faUser} 
            className="text-white cursor-pointer text-2xl p-3 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300"
            onClick={toggleUserOption} 
            aria-label="User Options"
          />
        </div>

        {showSearchBar && (
          <div
            ref={searchRef}
            className="absolute top-0.5 right-60 mt-2 mr-4 p-2 rounded-md shadow-lg hidden md:inline h-15.5 transform transition-transform duration-300 ease-in-out scale-95 translate-y-[-10px]"
            style={{ maxWidth: '600px' }}
          >
            <input
              type="text"
              placeholder="Search..."
              className="text-white px-3 py-1 border border-black focus:outline-none focus:border-black w-full md:max-w-96 bg-gray-700"
            />
          </div>
        )}

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