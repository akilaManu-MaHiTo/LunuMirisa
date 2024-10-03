import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faWhatsapp, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

const Footer = () => {
    const { userId } = useParams();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [review, setReview] = useState("");
    const [message, setMessage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const result = await axios.get(`http://localhost:3001/getUser/${userId}`);
                setFirstName(result.data.firstName || '');
                setLastName(result.data.lastName || '');
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/ShowProfilePic/${userId}`);
                setProfileImage(response.data.image);
                console.log("Profile picture data:", response.data); // Add this line
            } catch (error) {
                console.error('There was an error fetching the profile picture!', error);
                setError('There was an error fetching the profile picture!');
            }
        };
    
        fetchProfilePic();
    }, [userId]);
    

    const handleSubmit = async () => {
        if (rating === 0 || review === "" || reviewTitle === "") { // Check for review title
            setMessage("Please provide a title, rating, and a review.");
            return;
        }
    
        const data = {
            reviewTitle,  
            review,
            rating,
            userId,
            FirstName: firstName,
            LastName: lastName,
            profileImage: profileImage || 'default-image-url.jpg',
        };
        
        console.log(profileImage)
        setLoading(true);
    
        try {
            await axios.post('http://localhost:3001/PlaceReview', data);
            setMessage("Thank you for your review!");
            setRating(0);
            setReview("");
            setReviewTitle(""); // Reset review title after submission
        } catch (error) {
            console.error(error);
            setMessage("There was an error submitting your review. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <footer className="w-full h-auto py-10 text-white bg-custom-dark">
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
                        <FontAwesomeIcon icon={faFacebook} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-blue-600 " />
                        <FontAwesomeIcon icon={faFacebookMessenger} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-blue-300 " />
                        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-green-500 " />
                        <FontAwesomeIcon icon={faInstagram} className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-125 hover:text-purple-600 " />
                    </div>
                </div>

                <div className="font-spartan flex-1">
                    <div className="text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40">House of Operations</div>
                    <div className="ml-40 lg:ml-[10rem] mt-4 text-white">
                        <div className="font-bold mt-4">Monday - Friday: 7:00 AM - 10:00 PM</div>
                        <div className="font-bold mt-4">Saturday - Sunday: 8:00 AM - 11:00 PM</div>
                    </div>

                    <div className="items-center p-2 lg:pl-40 mt-5">
                        <div className="text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-0 mt-2">We would love to hear your thoughts!</div>
                        <div className="flex my-3">
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            className="hidden"
                                            onClick={() => setRating(ratingValue)}
                                        />
                                        <FontAwesomeIcon
                                            icon={ratingValue <= (hover || rating) ? faStar : faStarRegular}
                                            className={`text-2xl cursor-pointer transition-transform duration-300 ease-in-out transform ${
                                                ratingValue <= (hover || rating) ? 'hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(255,193,7,0.8)]' : ''
                                            }`}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                className="p-3 bg-custom-light w-[15rem] h-12 ml-1 focus:bg-custom-light-hover focus:transition duration-300 ease-in-out mt-3 placeholder:text-gray-400 placeholder:font-thin"
                                placeholder="Enter Review Title"
                                value={reviewTitle}
                                onChange={(e) => setReviewTitle(e.target.value)}
                            />

                            <input
                                type="text"
                                className="p-3 bg-custom-light w-[15rem] h-12 ml-1 focus:bg-custom-light-hover focus:transition duration-300 ease-in-out mt-3 placeholder:text-gray-400 placeholder:font-thin"
                                placeholder="Enter Your Review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-center w-[15rem] ">
                        <button
                            className="bg-white text-black h-10 mt-3 w-20 hover:bg-yellow-200 hover:text-black hover:scale-105 transition duration-300 ease-in-out"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        </div>


                        {message && <p className="text-white mt-2">{message}</p>}
                    </div>
                </div>
            </div>

            <div className="flex ml-40 lg:ml-[10rem]">
                <img src={logo} alt="Logo" className="w-24 h-auto" />
            </div>
        </footer>
    );
};

export default Footer;
