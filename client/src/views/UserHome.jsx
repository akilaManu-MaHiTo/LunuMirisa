import React from 'react';
//import { Link } from 'react-router-dom';
import logo from '../Images/OIP.jpeg'; // Ensure the path to your image is correct
import homePic from '../Images/food.jpg';
import NavigationBar from './NavigationBar'; // Import the NavigationBar component

const UserHome = () => {
  return (
    <div className="bg-custom-black min-h-screen ml-14 mr-16">
      
      <NavigationBar logo={logo} /> {/* Use the NavigationBar component */}

      <div className="flex justify-center mt-10 w-full h-full">
        <img src={homePic} alt="Home" className="w-full h-auto rounded opacity-50"style={{ filter: 'blur(1px)' }} /> 
        <div className='absolute text-white w-[40rem] left-20 hidden md:inline text-7xl pt-32 font-spartan'>Experience the Authentic Sri Lankan Foods</div>
        <div className='absolute text-white hidden -bottom-40 md:inline text-2xl bg-custom-black p-4 opacity-70'>
          <div className='opacity-100 font-spartan font-thin'>Order Now ↓</div>
        </div>
      </div>

      <div className='text-white pt-10 font-spartan font-thin'>Today's Special</div>

      <div className="flex flex-col md:flex-row md:space-x-2 items-center justify-center min-h-2 pt-10 pb-10">

        <div className="bg-white p-6 rounded shadow-md w-full max-w-md mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to User Home</h1>
          <p className="text-center">This is the user home page.</p>
          <p className="text-center">This is the user home page.</p>
        </div>

        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to User Home</h1>
          <p className="text-center">This is the user home page.</p>
          <p className="text-center">This is the user home page.</p>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
