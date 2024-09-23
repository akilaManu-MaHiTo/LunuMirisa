import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as emptyStar } from '@fortawesome/free-solid-svg-icons'; // Font Awesome icons for stars
import logo from '../Images/Logo.png'; 
import homePic from '../Images/food.png';
import NavigationBar from './Components/NavigationBar.jsx'; 
import Footer from './Footer.jsx'; 
import food from '../Images/food.svg';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

const UserHome = () => {
  const { userId } = useParams(); // Extract userId from URL
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0); // State to track the current review

  // Fetch reviews when component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/GetAllReviews')
      .then(response => {
        setReviews(response.data); // Store reviews in state
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  // Function to rotate reviews every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) =>
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds interval for the slideshow
    return () => clearInterval(interval); // Clean up on component unmount
  }, [reviews.length]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Full stars
    const halfStar = rating % 1 !== 0; // Check for half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Empty stars

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-400" />
        ))}
        {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={emptyStar} className="text-gray-400" />
        ))}
      </>
    );
  };

  return (
    <div className="bg-custom-black min-h-screen">
      <NavigationBar logo={logo} /> 

      <div className="flex w-full h-full">
        <img src={homePic} alt="Home" className="w-full h-auto rounded" style={{ filter: 'blur(1px)' }} />
        <div className="absolute text-white w-[50rem] pl-[10rem] hidden md:inline text-7xl pt-32 font-spartan">
          Experience the Authentic Sri Lankan Foods
        </div>
        <div className="absolute text-white hidden custom-md:flex justify-center text-2xl w-full mt-[50rem]">
          <div className="font-spartan font-thin bg-custom-black p-4 opacity-70"> Order Now ↓ </div>
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

      {/* User Reviews Section with Slideshow */}
      <div className="text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]">User Reviews</div>
      <div className="flex flex-col items-center justify-center py-8">
        {reviews.length > 0 ? (
          <div className="w-full px-10">
            <div key={currentReviewIndex} className="bg-gray-800 p-6 rounded my-4 w-full max-w-2xl transition-opacity duration-500 ease-in-out">
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-bold text-white mr-4">
                  {reviews[currentReviewIndex].FirstName} {reviews[currentReviewIndex].LastName}
                </h3>
                <div className="flex items-center">
                  {renderStars(reviews[currentReviewIndex].rating)} {/* Render the stars based on the rating */}
                </div>
              </div>
              <p className="text-gray-300 italic">{reviews[currentReviewIndex].review}</p>
            </div>
          </div>
        ) : (
          <p className="text-white">No reviews available.</p>
        )}
      </div>

      <p className="bg-yellow-500 text-white">User ID: {userId}</p>

      <Link to={`/TableReservationPage/${userId}`}>
        <button className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600">
          Table Reservation
        </button>
      </Link>

      <Footer />
    </div>
  );
};

export default UserHome;
