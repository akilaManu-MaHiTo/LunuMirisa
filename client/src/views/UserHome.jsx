import React from 'react';
import { useParams } from 'react-router-dom';
import logo from '../Images/Logo.png'; 
import homePic from '../Images/food.png';
import NavigationBar from './Components/NavigationBar.jsx'; 
import Footer from './Footer.jsx'; 
import food from '../Images/food.svg';
import reviewbg from '../Images/reviewSbg.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; // Import React-Slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; // Import Slick styles

const UserHome = () => {
  const { userId } = useParams(); // Extract userId from URL

  // Example reviews data
  const reviews = [
    {
      id: 1,
      user: 'Akila Manujith',
      comment: 'Amazing food! Will definitely come back.',
      rating: 5
    },
    {
      id: 2,
      user: 'Supun Hemaratne',
      comment: 'Best Sri Lankan food in town. Highly recommended!',
      rating: 4
    },
    {
      id: 3,
      user: 'Ashen Somaratne',
      comment: 'Great service and delicious meals.',
      rating: 5
    }
  ];

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

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
            <div key={index} className="bg-custom-gray p-6 rounded shadow-md w-[18rem] h-auto max-w-md mb-4 md:mb-0 flex flex-col items-center transition-transform duration-500 ease-in-out transform ">
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

{/* Review Section */}
<div className='text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]'>Customer Reviews</div>

<div className="flex justify-center items-center mt-16 pb-10">
  <Slider {...settings} className="w-[80rem] text-white">
    {reviews.map((review) => (
      <div 
        key={review.id} 
        className="bg-custom-gray p-8 rounded shadow-md flex flex-col items-center transition-transform duration-500 ease-in-out transform"
        style={{
          backgroundImage: `url(${reviewbg})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '20rem' // Similar height as other sections for uniformity
        }}
      >
        <div className="text-center font-spartan text-2xl mt-4 mb-4">{review.user}</div>
        <p className="text-center font-spartan text-xl mb-4">{review.comment}</p>
        <div className="text-center font-spartan text-2xl">
          {'⭐'.repeat(review.rating)}
        </div>
      </div>
    ))}
  </Slider>
</div>



      <div className='text-white text-5xl pt-8 font-spartan font-thin pl-[10rem]'>Table Reservation</div>

      <div className="flex justify-center items-center min-h-screen">
        <Link to={`/TableReservationPage/${userId}`}>
          <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ease-in-out">
            Table Reservation
          </button>
        </Link>
      </div>

      

      <Footer/> 
    </div>
  );
};

export default UserHome;
