import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as emptyStar, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png'; 
import homePic from '../Images/food.png';
import NavigationBar from './Components/NavigationBar.jsx'; 
import Footer from './Footer.jsx'; 
import food from '../Images/food.svg';

const UserHome = () => {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [slideDirection, setSlideDirection] = useState('left');

  useEffect(() => {
    axios.get('http://localhost:3001/GetAllReviews')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setSlideDirection('left'); // Slide out left
      setTimeout(() => {
        setCurrentReviewIndex((prevIndex) =>
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
        setSlideDirection('right'); // Slide in from right
        setFade(true);
      }, 500); // Time for fade out and slide transition
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-400" />
        ))}
        {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={emptyStar} className="text-gray-400" />
        ))}
        <span className="text-yellow-400 ml-2">{rating.toFixed(1)}</span> {/* Rating number */}
      </div>
    );
  };

  return (
    <div className="bg-custom-black min-h-screen">
      <NavigationBar logo={logo} /> 

      <div className="relative flex w-full h-full">
        <img src={homePic} alt="Home" className="w-full h-auto rounded" style={{ filter: 'blur(1px)' }} />
        <div className="absolute text-white w-[50rem] pl-[10rem] hidden md:inline text-7xl pt-32 font-spartan transition-opacity duration-1000 ease-in-out">
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
            <div key={index} className="bg-custom-gray p-6 rounded shadow-md w-[18rem] h-auto max-w-md mb-4 md:mb-0 flex flex-col items-center transition-all duration-500 ease-in-out transform hover:scale-105">
              <img src={food} alt="food" className='w-[15rem] h-auto rounded mx-auto mt-2' />
              <div className="text-center text-white font-spartan font-thin mt-8 text-2xl">Chicken Biriyani</div>
              <div className="text-center text-white font-spartan font-thin text-xl mt-2">Rs.1700/-</div>
              <button type="submit" className='flex mb-4 items-center justify-center w-[15rem] py-1 mt-16 bg-custom-light text-white hover:bg-white hover:text-black h-12 transition-all duration-300 ease-in-out transform hover:scale-105'>
                <FontAwesomeIcon icon={faCartPlus} className='mr-2' /> Add to Cart 
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className='text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]'>Popular Meals</div>

      <div className='flex justify-center gap-y-8'>
        <div className="flex flex-wrap gap-x-16 gap-y-8 pt-16 pb-10 justify-center w-[80rem]">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-custom-gray p-6 rounded shadow-md w-[18rem] h-auto max-w-md mb-4 md:mb-0 flex flex-col items-center transition-transform duration-500 ease-in-out transform hover:scale-105">
              <img src={food} alt="food" className='w-[15rem] h-auto rounded mx-auto mt-2' />
              <div className="text-center text-white font-spartan font-thin mt-8 text-2xl">Chicken Biriyani</div>
              <div className="text-center text-white font-spartan font-thin text-xl mt-2">Rs.1700/-</div>
              <button type="submit" className='flex mb-4 items-center justify-center w-[15rem] py-1 mt-16 bg-custom-light text-white hover:bg-white hover:text-black h-12 transition-all duration-300 ease-in-out transform hover:scale-105'>
                <FontAwesomeIcon icon={faCartPlus} className='mr-2' /> Add to Cart 
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]">User Reviews</div>
      <div className="flex flex-col items-center justify-center py-8">
        {reviews.length > 0 ? (
          <div
            className={`w-full px-10 transition-all duration-700 ease-in-out transform ${
              fade ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-' + (slideDirection === 'left' ? '-20' : '20')
            }`}
          >
            <div key={currentReviewIndex} className="bg-custom-dark p-10 rounded my-4 w-[45rem] h-[20rem] mx-auto">
              <div className="flex flex-col items-start">
                <div className="flex items-start">
                  <img
                    src={`http://localhost:3001/Images/${reviews[currentReviewIndex].profileImage}`}
                    alt="User"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white">
                      {reviews[currentReviewIndex].FirstName} {reviews[currentReviewIndex].LastName}
                    </h3>
                    <div className="flex flex-col mt-2">
                      <div className="flex items-center">
                        {renderStars(reviews[currentReviewIndex].rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-custom-gray h-[11rem] pl-4 pr-4 pb-4 pt-1 mt-3 rounded-xl'>
                <p className="text-gray-300 italic mt-5">{reviews[currentReviewIndex].review}</p>
              </div>
            </div>
          </div>
        ) : (
          /* From Uiverse.io by Ykingdev */ 
        <div
          class="flex flex-col gap-2 dark:text-white max-w-md w-full bg-white dark:bg-neutral-900 p-5 rounded-md mt-8 shadow-md hover:scale-105 hover:duration-150 duration-150"
        >
          <div class="flex flex-row justify-between w-full">
            <div class="flex flex-row justify-between w-full">
              <div
                class="bg-gray-200 dark:bg-neutral-700 rounded-md w-20 h-4 animate-pulse"
              ></div>
              <div
                class="bg-gray-200 dark:bg-neutral-700 rounded-md w-10 animate-pulse"
              ></div>
            </div>
          </div>
          <div class="flex flex-row justify-between w-full">
            <div
              class="bg-gray-200 dark:bg-neutral-700 rounded-md w-40 animate-pulse"
            ></div>

          <div class="text-xs">
            <div class="flex flex-row">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                class="h-4 w-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"
                ></path>
              </svg>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                class="h-4 w-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"
                ></path>
              </svg>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                class="h-4 w-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"
                ></path>
              </svg>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                class="h-4 w-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"
                ></path>
              </svg>

              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                class="h-4 w-4 text-yellow-200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div
          class="bg-gray-200 dark:bg-neutral-700 rounded-md w-full h-20 animate-pulse"></div>
        </div>

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
