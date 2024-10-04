import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as emptyStar, faCartPlus, faArrowAltCircleLeft, faArrowCircleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png';
import homePic from '../Images/home-bg.jpg';
import bgtable from '../Images/table-bg.jpg';
import bgReview from '../Images/review-bg.jpg';
import NavigationBar from './Components/NavigationBar.jsx';
import Footer from './Footer.jsx';
import food from '../Images/food.svg';

const FoodItem = ({ image, title, price, percentage, change }) => (
<div className="relative bg-custom-gray p-6 rounded-xl shadow-md w-[18rem] h-auto max-w-md mb-4 flex flex-col items-center transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]">
{/* Red strap for Hot Deals */}
  <div className="absolute top-0 left-0 bg-red-600 text-white font-spartan text-[0.9rem] font-light py-1 px-3 rounded-tr-lg rounded-bl-lg z-10 opacity-75">
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
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchHotDeals = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getHotDeals');
        setHotDeals(response.data);
      } catch (error) {
        setError('Failed to load hot deals. Please try again later.');
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
        setCurrentReviewIndex((prevIndex) =>
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-custom-black min-h-screen">
      <NavigationBar logo={logo} />

      <header>
        <div className="relative flex w-full h-full">
          <img src={homePic} alt="Home" className="w-full h-auto rounded" style={{ filter: 'blur(1px)' }} />
          <div className="absolute select-none text-white w-[50rem] pl-[10rem] hidden md:inline text-7xl pt-32 font-spartan transition-opacity duration-1000 ease-in-out">
            Experience the Authentic Sri Lankan Foods
          </div>
          <div className="absolute text-white hidden custom-md:flex justify-center text-2xl w-full mt-[50rem]">
          </div>
        </div>
      </header>

      <section>
        <div className="text-white text-5xl pt-20 font-spartan font-thin pl-[10rem] select-none">Today's Special</div>

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

        <div className="text-white text-5xl pt-8 font-spartan font-thin pl-[10rem] select-none">Popular Meals</div>

        <div className="flex justify-center gap-y-8">
          <div className="flex flex-wrap gap-x-16 gap-y-8 pt-16 pb-10 justify-center w-[80rem]">
            {[...Array(3)].map((_, index) => (
              <FoodItem key={index} image={food} title="Chicken Biriyani" price="1700" percentage={0} />
            ))}
          </div>
        </div>
        <div className="text-white text-5xl pt-8 font-spartan font-thin pl-[10rem] select-none">Reserve Tables</div>

        <div className="flex items-center justify-center mt-10 ">
          <div className="w-[65rem] h-[30rem] relative"
              style={{ 
                  backgroundImage: `url(${bgtable})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
              }}>

            
            <div className="absolute inset-0 bg-black opacity-60 z-90 border border-white"></div>
            
            
            <div className="absolute inset-0 flex flex-col justify-center items-start z-20 px-12">
              <h1 className="text-white text-4xl font-spartan font-semibold mb-10 select-none">
                Reserve Your Table for an Unforgettable Dining Experience
              </h1>
              <p className="text-white w-[40rem] ml-5 text-xl font-spartan font-light leading-relaxed select-none">
                Enjoy the finest flavors of authentic Sri Lankan cuisine at Lunumirisa. Whether you’re planning a special night out, a family gathering, or simply wish to savor an exquisite meal, reserving a table guarantees that you’ll be part of a culinary journey unlike any other. Our cozy, elegant ambiance and carefully crafted dishes ensure that every moment is a delight. Reserve your table today and let us take care of the rest—your unforgettable dining experience awaits!
              </p>

              <Link to={`/TableReservationPage/${userId}`}>
              <button className="absolute bottom-10 right-10 w-auto h-12 px-5 text-black bg-white transition-all ease-in-out transform hover:scale-105 flex items-center justify-center gap-2
              tracking-widest rounded-md mr-10 hover:bg-black hover:text-white duration-300 hover:gap-2 hover:translate-x-3 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                Book Now
                <FontAwesomeIcon icon={faArrowRight} />        
              </button>
              </Link>
            </div>
          </div>
        </div>








        return (
  <div>
    <div className="text-white text-5xl mt-16 mb-16 font-spartan font-thin pl-[10rem]">
      What keeps you coming back to us?
    </div>
    {reviews.length > 0 && reviews[currentReviewIndex] ? (
      <div
        className={`w-full px-10 transition-all duration-700 ease-in-out transform ${
          fade ? 'opacity-100 translate-x-0' : 'opacity-0'
        }`}
      >
        <div
          key={currentReviewIndex}
          className="p-10 mb-20 rounded my-4 w-[65rem] h-[25rem] mx-auto"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgReview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
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
            <p className="text-gray-300 text-2xl font-bold italic mt-5">
              {reviews[currentReviewIndex].reviewTitle}
            </p>
            <div className="bg-white bg-opacity-70 h-[11rem] pl-4 pr-4 pb-4 pt-1 mt-3 rounded-xl">
              <p className="text-black italic mt-5">{reviews[currentReviewIndex].review}</p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-white text-center">No reviews available</div>
    )}
  </div>
);


      </section>

      <Footer />
    </div>
  );
};

export default UserHome;
