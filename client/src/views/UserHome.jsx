import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as emptyStar, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png';
import homePic from '../Images/home-bg.jpg';
import bgtable from '../Images/table.jpg';
import NavigationBar from './Components/NavigationBar.jsx';
import Footer from './Footer.jsx';
import food from '../Images/food.svg';

const FoodItem = ({ image, title, price, percentage, change }) => (
<div className="relative bg-custom-gray p-6 rounded-xl shadow-md w-[18rem] h-auto max-w-md mb-4 flex flex-col items-center transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]">
{/* Red strap for Hot Deals */}
  <div className="absolute top-0 left-0 bg-red-600 text-white font-spartan text-xs font-thin py-1 px-3 rounded-tr-lg rounded-bl-lg z-10 opacity-75">
    Save Rs.-{change}
  </div>
  
  <img src={image} alt={title} className="w-48 h-44 bg-cover mt-5 bg-center transition-all duration-500 hover:shadow-2xl" />
  
  <div className="text-center text-white font-spartan font-thin mt-8 text-2xl">{title}</div>
  
  <div className="text-center text-white font-spartan font-semibold text-xl mt-2">
    Rs.{(price * (100 - percentage) / 100).toFixed(2)}/- {/* Ensure precision */}
  </div>
  
  
  <button
    type="button"
    className="flex mb-4 items-center justify-center w-[15rem] py-1 mt-16 bg-custom-light text-white hover:bg-white hover:text-black h-12 transition-all duration-300 ease-in-out transform hover:scale-105"
  >
    <FontAwesomeIcon icon={faCartPlus} className="mr-2" /> Add to Cart
  </button>
</div>

);

const UserHome = () => {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/GetAllReviews');
        setReviews(response.data);
      } catch (error) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    const fetchHotDeals = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getHotDeals');
        setHotDeals(response.data);
      } catch (error) {
        console.error('Error fetching hot deals:', error);
      }
    };

    fetchReviews();
    fetchHotDeals();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentReviewIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));
        setFade(true);
      }, 500);
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
        <span className="text-yellow-400 ml-2">{rating.toFixed(1)}</span> {/* Show precise rating */}
      </div>
    );
  };

  return (
    <div className="bg-custom-black min-h-screen">
      <NavigationBar logo={logo} />

      <header>
        <div className="relative flex w-full h-full">
          <img src={homePic} alt="Home" className="w-full h-auto rounded" style={{ filter: 'blur(1px)' }} />
          <div className="absolute text-white w-[50rem] pl-[10rem] hidden md:inline text-7xl pt-32 font-spartan transition-opacity duration-1000 ease-in-out">
            Experience the Authentic Sri Lankan Foods
          </div>
          <div className="absolute text-white hidden custom-md:flex justify-center text-2xl w-full mt-[50rem]">
            <div className="font-spartan font-thin bg-custom-black p-4 opacity-70">Order Now ↓</div>
          </div>
        </div>
      </header>

      <section>
        <div className="text-white text-5xl pt-20 font-spartan font-thin pl-[10rem]">Today's Special</div>

        <div className="flex justify-center gap-y-8">
          <div className="flex flex-wrap gap-x-16 gap-y-8 pt-16 pb-10 justify-center w-[80rem]">
            {hotDeals.map((hot, index) => (
              <FoodItem
                key={index}
                image={`http://localhost:3001/Images/${hot.image}`}
                title={hot.title}
                price={hot.price}
                percentage={hot.percentage}
                change = {hot.price*(hot.percentage/100)}
              />
            ))}
          </div>
        </div>

        <div className="text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]">Popular Meals</div>

        <div className="flex justify-center gap-y-8">
          <div className="flex flex-wrap gap-x-16 gap-y-8 pt-16 pb-10 justify-center w-[80rem]">
            {[...Array(3)].map((_, index) => (
              <FoodItem key={index} image={food} title="Chicken Biriyani" price="1700" percentage={0} />
            ))}
          </div>
        </div>

        <div className="text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]">Reserve Tables</div>

        <div className="flex items-center justify-center mt-10">
          <div className="w-[65rem] h-[30rem] relative"
              style={{ 
                  backgroundImage: `url(${bgtable})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
              }}>

            {/* Black transparent overlay */}
            <div className="absolute inset-0 bg-black opacity-10 z-10"></div>
            
            {/* Text container */}
            <div className="absolute inset-0 flex flex-col justify-center items-start z-20 px-12">
              <h1 className="text-white text-3xl font-spartan font-semibold mb-10">
                Reserve Your Table for an Unforgettable Dining Experience
              </h1>
              <p className="text-white text-lg font-spartan font-light leading-relaxed">
                Enjoy the finest flavors of authentic Sri Lankan cuisine at Lunumirisa. Whether you’re planning a special night out, a family gathering, or simply wish to savor an exquisite meal, reserving a table guarantees that you’ll be part of a culinary journey unlike any other. Our cozy, elegant ambiance and carefully crafted dishes ensure that every moment is a delight. Reserve your table today and let us take care of the rest—your unforgettable dining experience awaits!
              </p>
              
              <button className="w-20 h-10 text-white">
                Book Now
              </button>

            </div>
          </div>
        </div>





        <div className="text-white text-5xl mt-10 font-spartan font-thin pl-[10rem]">User Reviews</div>
        <div className="flex flex-col items-center justify-center py-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div> {/* Loading spinner */}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : reviews.length > 0 ? (
            <div
              className={`w-full px-10 transition-all duration-700 ease-in-out transform ${
                fade ? 'opacity-100 translate-x-0' : 'opacity-0'
              }`}
            >
              <div key={currentReviewIndex} className="bg-custom-dark p-10 rounded my-4 w-[50rem] h-[25rem] mx-auto">
                <div className="flex flex-col items-start">
                  <div className="flex items-start">
                    <img
                      src={`http://localhost:3001/Images/${reviews[currentReviewIndex].profileImage}`}
                      alt={`${reviews[currentReviewIndex].FirstName} ${reviews[currentReviewIndex].LastName}`}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold text-white">
                        {reviews[currentReviewIndex].FirstName} {reviews[currentReviewIndex].LastName}
                      </h3>
                      <div className="flex flex-col mt-2">
                        <div className="flex items-center">{renderStars(reviews[currentReviewIndex].rating)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-2xl font-bold italic mt-5">{reviews[currentReviewIndex].reviewTitle}</p>
                  <div className="bg-custom-gray h-[11rem] pl-4 pr-4 pb-4 pt-1 mt-3 rounded-xl">
                    <p className="text-gray-300 italic mt-5">{reviews[currentReviewIndex].review}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white">No reviews available.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserHome;
