import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from './Components/NavigationSignup'
import logo from '../Images/Logo.png'
import homePic from '../Images/food.png';
import food from '../Images/food.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as emptyStar, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import Footer from './Components/FooterStartPage'; 



function Users() {

    const [users, setUsers] = useState([]);


    useEffect(() => {
        axios.get('https://lunu-mirisa.vercel.app/')
            .then(result => setUsers(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {

      axios.delete('http://localhost:3001/deleteUser/'+id)
      .then(res => {console.log(res)

        window.location.reload()

      })
      .catch(err => console.log(err))
    }

    return (
        <div>
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

      <Footer logo={logo} />
        </div>
    );
}

export default Users;
