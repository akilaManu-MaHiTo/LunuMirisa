import React from 'react';
//import { Link } from 'react-router-dom';
import logo from '../Images/OIP.jpeg'; // Ensure the path to your image is correct
import NavigationBar from './NavigationBar'; // Import the NavigationBar component

const UserHome = () => {
  return (
    <div className="bg-custom-black min-h-screen ml-14 mr-16">
      
      <NavigationBar logo={logo} /> {/* Use the NavigationBar component */}

      <div className="flex flex-col md:flex-row md:space-x-2 items-center justify-center min-h-screen">
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
