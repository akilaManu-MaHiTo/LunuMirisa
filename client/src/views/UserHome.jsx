import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as emptyStar, faCartPlus, faArrowAltCircleLeft, faArrowCircleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png';
import homePic from '../Images/home-bg.jpg';
import bgtable from '../Images/table-bg.jpg';
import bgHome from '../Images/home-scroll.jpg'
import bgHome2 from '../Images/loginBG.jpg'
import NavigationBar from './Components/NavigationBar.jsx';
import Footer from './Footer.jsx';
import food from '../Images/food.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodItem = ({ image, title, price, percentage, change ,handleAddToCart,item}) => (
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
    onClick={() => handleAddToCart(item)}
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
  
  const handleAddToCart = (item) => {
    const scrollPosition = window.scrollY;
    localStorage.setItem('scrollPosition', scrollPosition);
    const total = item.price * (100 - item.percentage) / 100
    axios.post("http://localhost:3001/Addtocarts", {
      userId:userId,
      itemId: item._id,
      category: item.category,
      title: item.title,
      price: total,
      image: item.image,
    })
    .then(() => {
      toast.success(`${item.title} added to cart successfully!`);
      window.location.reload();
    })
    .catch((error) => {
      // Check if the error response has a status of 400
      if (error.response && error.response.status === 400) {
        toast.error(`Item already exists in the cart.`);
        console.log({
          userId,
          itemId: item._id,
          category: item.category,
          title: item.title,
          price: item.price,
          image: item.image,
        });
      } else {
        toast.error(`Error adding ${item.title} to cart. Please try again!`);
      }
    });
  };

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

  const topThreeDeals = hotDeals.slice(0, 3);

  return (
    <div className="bg-custom-black min-h-screen">
      <NavigationBar logo={logo} />

      <header>
        <div className="flex w-full h-full">
          <img src={homePic} alt="Home" className="w-full h-auto rounded" style={{ filter: 'blur(1px)' }} />
          <div className="absolute select-none text-white w-[50rem] pl-[10rem] hidden md:inline text-7xl pt-32 font-spartan transition-opacity duration-1000 ease-in-out">
            Experience the Authentic Sri Lankan Foods
          </div>


        </div>
      </header>

      <section>
        <div className="text-white text-5xl pt-20 font-spartan font-thin pl-[10rem] select-none">Today's Special</div>

        <div className="flex justify-center gap-y-8 mb-10">
          <div className="flex flex-wrap gap-x-16 gap-y-8 pt-16 pb-10 justify-center w-[80rem]">
            {topThreeDeals.map((hot, index) => (
              <FoodItem
                key={index}
                image={`http://localhost:3001/Images/${hot.image}`}
                title={hot.title}
                price={hot.price}
                percentage={hot.percentage}
                change={(hot.price * (hot.percentage / 100)).toFixed(2)}
                handleAddToCart={handleAddToCart}
                item={hot}
              />
            ))}
          </div>
        </div>


        
        <div className="parallax">
          <div 
            className="parallax-background"
            style={{ backgroundImage: `url(${bgHome})` }} 
          />
          {/* Black transparent overlay */}
          <div className="overlay" />
          <div className="parallax-content">
            {/* Section Title */}
            <div className="text-white text-3xl sm:text-4xl md:text-5xl pt-4 sm:pt-6 md:pt-8 font-spartan font-thin px-4 sm:pl-[5rem] md:pl-[10rem] select-none">
              Popular Meals
            </div>

            {/* Scrollable Container */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-x-36 sm:gap-x-24 p-10 sm:p-10  overflow-x-auto w-full px-4 sm:px-0 scrollbar-hide md:justify-center">
                {[...Array(3)].map((_, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-48 sm:w-64"
                  >
                    <FoodItem 
                      image={food} 
                      title="Chicken Biriyani" 
                      price="1700" 
                      percentage={0} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>







        <div className="text-white text-3xl sm:text-4xl md:text-5xl pt-8 font-spartan font-thin px-10 sm:px-8 md:pl-[10rem] select-none mt-10 text-center md:text-left">
          Reserve Tables
        </div>

        <div className="flex items-center justify-center mt-10 px-4">
          <div 
            className="w-[70rem] max-w-[70rem] h-[40rem] sm:h-[45rem] relative"
            style={{ 
              backgroundImage: `url(${bgtable})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0  bg-black opacity-60 z-90 border border-white"></div>

            {/* Content container */}
            <div className="absolute inset-0 flex flex-col justify-center items-start z-20 px-6 sm:px-8 md:px-12">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl mt-10 font-spartan font-semibold mb-6 sm:mb-8 select-none">
                Reserve Your Table for an Unforgettable Dining Experience
              </h1>
              <p className="text-white w-full max-w-2xl text-sm sm:text-base md:text-xl font-spartan font-light leading-relaxed select-none mb-8">
                Enjoy the finest flavors of authentic Sri Lankan cuisine at Lunumirisa. Whether you’re planning a special night out, a family gathering, or simply wish to savor an exquisite meal, reserving a table guarantees that you’ll be part of a culinary journey unlike any other. Our cozy, elegant ambiance and carefully crafted dishes ensure that every moment is a delight. Reserve your table today and let us take care of the rest—your unforgettable dining experience awaits!
              </p>

              <Link to={`/TableReservationPage/${userId}`}>
                <button className="mt-6 w-auto h-10 sm:h-12 px-4 sm:px-5 text-black bg-white transition-all ease-in-out transform hover:scale-105 flex items-center justify-center gap-2
                tracking-widest rounded-md hover:bg-black hover:text-white duration-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                  Book Now
                  <FontAwesomeIcon icon={faArrowRight} />        
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="parallax-review mt-20">
        <div
          className="parallax-background"
          style={{ backgroundImage: `url(${bgHome2})` }}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>

          <div className="text-white text-3xl sm:text-4xl md:text-5xl mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-12 md:mb-16 font-spartan font-thin pl-4 sm:pl-8 md:pl-16 z-20 relative">
            What keeps you coming back to us?
          </div>

          {reviews.length > 0 && reviews[currentReviewIndex] ? (
            <div
              className={`w-full px-4 sm:px-6 md:px-10 transition-all duration-700 ease-in-out transform ${
                fade ? 'opacity-100 translate-x-0' : 'opacity-0'
              }`}
            >
              <div
                key={currentReviewIndex}
                className="p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 md:mb-20 bg-custom-gray opacity-95 rounded my-4 w-full sm:w-[40rem] md:w-[50rem] lg:w-[65rem] h-auto mx-auto"
              >
                <div className="flex flex-col sm:flex-row items-start">
                  <img
                    src={`http://localhost:3001/Images/${reviews[currentReviewIndex].profileImage}`}
                    alt={`${reviews[currentReviewIndex].FirstName} ${reviews[currentReviewIndex].LastName}`}
                    className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full mr-4"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {reviews[currentReviewIndex].FirstName} {reviews[currentReviewIndex].LastName}
                    </h3>
                    <div className="flex flex-col mt-2">
                      <div className="flex items-center">
                        {renderStars(reviews[currentReviewIndex].rating)}
                      </div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-300">
                        {new Date(reviews[currentReviewIndex].createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-xl sm:text-2xl md:text-3xl font-light mt-5 ml-2 mb-5">
                    {reviews[currentReviewIndex].reviewTitle}
                  </p>
                  <div className="bg-black bg-opacity-50 text-black h-auto sm:h-[11rem] md:h-[15rem] pl-4 pr-4 pb-4 pt-1 mt-3 rounded-xl">
                    <p className="text-white text-lg sm:text-xl md:text-2xl italic mt-5">
                      {reviews[currentReviewIndex].review}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 dark:text-white max-w-md w-full bg-white dark:bg-neutral-900 p-5 rounded-md mt-8 shadow-md hover:scale-105 hover:duration-150 duration-150">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row justify-between w-full">
                  <div className="bg-gray-200 dark:bg-neutral-700 rounded-md w-20 h-4 animate-pulse"></div>
                  <div className="bg-gray-200 dark:bg-neutral-700 rounded-md w-10 animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-row justify-between w-full">
                <div className="bg-gray-200 dark:bg-neutral-700 rounded-md w-40 animate-pulse"></div>
                <div className="text-xs">
                  <div className="flex flex-row">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-neutral-700 rounded-md w-full h-20 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>


      </section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Footer />
    </div>
  );
};

export default UserHome;
