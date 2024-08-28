import React from 'react';
import { useParams } from 'react-router-dom';
import logo from '../Images/Logo.png'; 
import homePic from '../Images/food.png';
import NavigationBar from './NavigationBar'; 
import Footer from './Footer.jsx'; 
import food from '../Images/food.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const UserHome = () => {
  const { userId } = useParams(); // Extract userId from URL

  return (
    <div className="bg-custom-black min-h-screen">
      <NavigationBar logo={logo} /> 

      <div className="flex  w-full h-full">
        <img src={homePic} alt="Home" className="w-full h-auto rounded" style={{ filter: 'blur(1px)' }} /> 
        <div className='absolute text-white w-[50rem] pl-[10rem] hidden md:inline text-7xl pt-32 font-spartan'>Experience the Authentic Sri Lankan Foods</div>
        <div className='absolute text-white hidden custom-md:flex justify-center text-2xl w-full mt-[50rem]'>
          <div className='font-spartan font-thin bg-custom-black p-4 opacity-70 '> Order Now ↓ </div>
        </div>

        
      </div>

      <div className='text-white text-5xl pt-20 font-spartan font-thin pl-[10rem]'>Today's Special</div>

      <div className='flex justify-center gap-y-8'>
        <div className="flex flex-wrap gap-x-16 gap-y-8 pt-16 pb-10 justify-center w-[80rem]">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-custom-gray p-6 rounded shadow-md w-[18rem] h-auto max-w-md mb-4 md:mb-0 flex flex-col items-center transition-all duration-500 ease-in-out transform  ">
            <img src={food} alt="food" className='w-[15rem] h-auto rounded mx-auto mt-2' />
              <div className="text-center text-white font-spartan font-thin mt-8 text-2xl">Chicken Biriyani</div>
              <div className="text-center text-white font-spartan font-thin text-xl mt-2">Rs.1700/-</div>
              <button type="submit" className='flex mb-4 items-center justify-center w-[15rem] py-1 mt-16 bg-custom-light text-white hover:bg-white hover:text-black h-12 transition-all duration-300 ease-in-out transform hover:scale-105'>
              <FontAwesomeIcon icon={faCartPlus} className='mr-2' /> Add to Cart </button>
            </div>
          ))}
        </div>
      </div>
    

      <div className='text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]'>Popular Meals</div>

      <div className='flex justify-center gap-y-8'>
        <div className="flex flex-wrap gap-x-16 gap-y-8 pt-16 pb-10 justify-center w-[80rem]">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-custom-gray p-6 rounded shadow-md w-[18rem] h-auto max-w-md mb-4 md:mb-0 flex flex-col items-center transition-transform duration-500 ease-in-out transform ">
              <img src={food} alt="food" className='w-[15rem] h-auto rounded mx-auto mt-2' />
              <div className="text-center text-white font-spartan font-thin mt-8 text-2xl">Chicken Biriyani</div>
              <div className="text-center text-white font-spartan font-thin text-xl mt-2">Rs.1700/-</div>
              <button type="submit" className='flex mb-4 items-center justify-center w-[15rem] py-1 mt-16 bg-custom-light text-white hover:bg-white hover:text-black h-12 transition-all duration-300 ease-in-out transform hover:scale-105'>
              <FontAwesomeIcon icon={faCartPlus} className='mr-2' /> Add to Cart </button>
            </div>
          ))}
        </div>
      </div>

      <div className='text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]'>Table Resevation</div>

      <div class="flex justify-center items-center min-h-screen">
  <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ease-in-out">
    Table Reservation
  </button>
</div>

      
        <p>User ID: {userId}</p>

        <Link to={`/TableReservationPage`}>
                  <button className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600">
                    Table Reservation
                  </button>
                </Link>

      <Footer/> 
      
      </div>
  );
};

export default UserHome;
