import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faBars, faCalendarCheck, faTimes, faHome, faUtensils, faTag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const NavigationBar = ({ logo }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);  // State for menu bar toggle
  const { userId } = useParams();

  useEffect(() => {
    axios.get(`https://lunu-mirisa.vercel.app/countCartItems/${userId}`)
      .then(response => {
        setCartItemCount(response.data.count); 
      })
      .catch(error => {
        console.error('Error fetching cart item count:', error);
      });
  }, [userId]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className='custom1-md:pr-[10rem] custom1-md:pl-[10rem] bg-custom-gray'>
      <nav className="flex items-center justify-between px-4">
        <div className="flex items-center h-36 w-32">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-auto w-20 ml-5 md:h-24 md:w-32 sm:h-16 sm:w-24" 
          />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="space-x-4 self-center hidden md:flex">
          <li><Link to={`/UserHome/${userId}`} className="text-white font-spartan font-thin text-2xl">Home</Link></li>
          <li><Link to={`/ShowMenuList/${userId}`} className="text-white font-spartan font-thin text-2xl">Menu</Link></li>
          <li><Link to="/" className="text-white font-spartan font-thin text-2xl">Offers</Link></li>
        </ul>

        {/* Mobile View Navigation Links (Icons Only) */}
        <ul className={`flex space-x-10 mr-10 mt-4 self-center md:hidden ${menuOpen ? 'hidden' : 'flex'}`}>
          <li className="flex flex-col items-center">
            <Link to={`/UserHome/${userId}`} className="text-white">
              <FontAwesomeIcon icon={faHome} className="text-3xl" />
            </Link>
            <span className="text-xs text-white mt-1">Home</span> {/* Small text below icon */}
          </li>
          <li className="flex flex-col items-center">
            <Link to={`/ShowMenuList/${userId}`} className="text-white">
              <FontAwesomeIcon icon={faUtensils} className="text-3xl" />
            </Link>
            <span className="text-xs text-white mt-1">Menu</span> {/* Small text below icon */}
          </li>
          <li className="flex flex-col items-center">
            <Link to="/" className="text-white">
              <FontAwesomeIcon icon={faTag} className="text-3xl" />
            </Link>
            <span className="text-xs text-white mt-1">Offers</span> {/* Small text below icon */}
          </li>
        </ul>


        {/* Icons for Cart, Calendar, User, etc. */}
        <div className="items-center space-x-4 hidden md:flex">
          <Link to={`/MyTableReservations/${userId}`}>
            <FontAwesomeIcon 
              icon={faCalendarCheck} 
              className="text-white cursor-pointer inline text-[1.6rem] p-3 transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </Link>

          <Link to={`/UserCart/${userId}`} className="relative inline-block">
            <FontAwesomeIcon 
              icon={faShoppingCart} 
              className="text-white cursor-pointer inline text-2xl p-3 mt-1 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300"
              aria-label="Shopping Cart"
            />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          <FontAwesomeIcon 
            icon={faUser} 
            className="text-white cursor-pointer text-2xl p-3 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300"
            aria-label="User Options"
          />
        </div>

        {/* Mobile Hamburger Menu */}
        <FontAwesomeIcon 
          icon={faBars} 
          className={`text-white cursor-pointer text-3xl mr-5 md:hidden hamburger-icon ${menuOpen ? 'hide' : ''}`} 
          onClick={toggleMenu} 
        />
      </nav>

      {/* Mobile View Additional Links - visible when menu is open */}
      <div className={`mobile-menu fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden ${menuOpen ? 'open' : ''}`}>
        <div className="flex justify-end p-4">
          <FontAwesomeIcon 
            icon={faTimes} 
            className="text-white cursor-pointer text-2xl" 
            onClick={toggleMenu} 
          />
        </div>
        
        {/* Additional Links inside the Mobile Menu */}
        <div className="flex flex-col items-center space-y-4 text-white">
          <Link to={`/MyTableReservations/${userId}`} className="text-2xl">Reservations</Link>
          <Link to={`/UserCart/${userId}`} className="text-2xl">Shopping Cart</Link>
          <Link to={`/UserProfile/${userId}`} className="text-2xl">Profile Settings</Link>
          <Link to={`/Login`} className="text-2xl text-red-500">Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
