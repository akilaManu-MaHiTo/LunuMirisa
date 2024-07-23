import React from 'react';
import logo from '../Images/Logo.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-footer-bg bg-cover bg-center w-full h-auto py-10 text-white">

        <div className="flex flex-col lg:flex-row"> 
            <div>
                <div className="text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40">Contact Us</div>
                <address className="not-italic">
                    <div className="flex text-white pl-10 lg:pl-40 pt-4 font-spartan">
                        <div className="font-bold">Address - </div>
                        <div className="font-thin">&nbsp; No 76 Colombo Road, Raththanapitiya, Boralesgamuwa</div>
                    </div>
                    <div className="flex text-white pl-10 lg:pl-40 pt-4 font-spartan">
                        <div className="font-bold">Phone - </div>
                        <div className="font-thin">&nbsp; 0112 150 059</div>
                    </div>
                    <div className="flex text-white pl-10 lg:pl-40 pt-4 font-spartan">
                        <div className="font-bold">Email - </div>
                        <div className="font-thin">&nbsp; Lunumirisa@gmail.com</div>
                    </div>
                </address>

                <div className="text-white text-2xl pt-10 font-spartan font-thin pl-10 lg:pl-40">Follow Us</div>
                <div className="flex text-white pl-12 lg:pl-52 pt-4 space-x-4">
                <FontAwesomeIcon icon={faFacebook} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125" />
                <FontAwesomeIcon icon={faFacebookMessenger} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125" />
                <FontAwesomeIcon icon={faWhatsapp} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125" />
                <FontAwesomeIcon icon={faInstagram} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125" />

                </div>

                <div className="flex ml-40 lg:ml-[10rem] pt-10">
                    <img src={logo} alt="Logo" className="w-24 h-auto" />
                </div>
            </div>

            <div className="font-spartan flex-1">
                <div className="text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40">House of Operations</div>
                <div className="ml-40 lg:ml-[10rem] mt-4 text-white">
                    <div className="font-bold mt-4">Monday - Friday: 7:00 AM - 10:00 PM</div>
                    <div className="font-bold mt-4">Saturday - Sunday: 8:00 AM - 11:00 PM</div>
                </div>

                <div className="text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40 mt-5">Quick Link</div>
                <div className="text-white font-thin ml-44 lg:ml-[11rem]">
                    <div className="flex justify-between mt-4">
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="hover:underline">Home</a>
                            <a href="#" className="hover:underline">Menu</a>
                            <a href="#" className="hover:underline">Reservation</a>
                        </div>
                        <div className="flex flex-col space-y-2 mr-[32rem] ">
                            <a href="#" className="hover:underline">Catering</a>
                            <a href="#" className="hover:underline">About Us</a>
                            <a href="#" className="hover:underline">Contact</a>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40 mt-2">News Letter</div>
                    <input type="text" className="border-white bg-custom-light w-[15rem] h-12 ml-[10rem]" />
                    <button className="bg-custom-gray ml-4 h-12 w-20">Send</button>
                </div>
            </div>
        </div>

        <div className="mt-10 text-center font-thin text-xs select-none">
            Privacy Policy | Terms of Service © 2024 Lunumirisa. All Rights Reserved.
        </div>

    </footer>
  );
};

export default Footer;
