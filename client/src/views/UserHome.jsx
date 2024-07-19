import React from 'react';
import { useParams } from 'react-router-dom';
import logo from '../Images/OIP.jpeg'; 
import homePic from '../Images/food.jpg';
import NavigationBar from './NavigationBar'; 
import food from '../Images/Biriyani.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

const UserHome = () => {
  const { userId } = useParams(); // Extract userId from URL

  return (
    <div className="bg-custom-black min-h-screen ml-14 mr-16">
      <NavigationBar logo={logo} /> 

      <div className="flex justify-center mt-10 w-full h-full">
        <img src={homePic} alt="Home" className="w-full h-auto rounded opacity-50" style={{ filter: 'blur(1px)' }} /> 
        <div className='absolute text-white w-[40rem] left-20 hidden md:inline text-7xl pt-32 font-spartan'>Experience the Authentic Sri Lankan Foods</div>
        <div className='absolute text-white -bottom-32 hidden custom-md:inline text-2xl bg-custom-black p-4 opacity-70'>
          <div className='opacity-100 font-spartan font-thin'>Order Now ↓</div>
        </div>
      </div>

      <div className='text-white pt-10 font-spartan font-thin'>Today's Special</div>

      <div className="flex flex-wrap md:gap-6 pt-10 pb-10 justify-center">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-custom-gray h-[28rem] p-6 rounded shadow-md w-[20rem] max-w-md mb-4 md:mb-0">
            <img src={food} alt="food" className='w-full h-auto rounded' />
            <div className="text-center text-white font-spartan font-thin m-4">Chicken Biriyani</div>
            <div className="text-center text-white font-spartan font-thin">Rs.1700/-</div>
            <button type="submit" className='flex items-center justify-center w-full py-1 mt-4 bg-custom-light text-white hover:bg-gray-700'>
              <FontAwesomeIcon icon={faCartPlus} className='mr-2' /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    
      <div className="text-white text-center mt-4">
        <p>User ID: {userId}</p>
      </div>

    </div>
  );
};

export default UserHome;
