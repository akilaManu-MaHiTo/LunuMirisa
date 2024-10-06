import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
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
        <footer className="w-full h-auto py-10 text-white bg-custom-dark flex justify-center items-center">
            <div className="w-full max-w-screen-xl">
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

                        
                        <div className="text-white text-2xl font-spartan font-thin mt-7 pl-10 lg:pl-40">House of Operations</div>
                        <div className="ml-40 lg:ml-[10rem] text-white">
                            <div className="font-light mt-3">Monday - Friday: 7:00 AM - 10:00 PM</div>
                            <div className="font-light mt-3">Saturday - Sunday: 8:00 AM - 11:00 PM</div>
                        </div>
                    </div>

                    <div className="font-spartan flex-1">

                        <div className="items-center p-2 lg:pl-40 ">
                            <div className="text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-0 mb-5">We would love to hear your thoughts!</div>
                            
                            <div className="flex flex-col bg-custom-light p-5 w-96 rounded-lg">

                                <div class="flex flex-col-reverse mb-5">
                                <input
                                    placeholder="Enter Title"
                                    class="peer outline-none border rounded bg-custom-gray p-3 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
                                    type="text"
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                />
                                <span
                                    class="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0"
                                    >Enter Title</span
                                >
                                </div>

                                <textarea
                                    type="textarea"
                                    className="p-3 bg-custom-gray rounded w-full h-28 text-white"
                                    placeholder="Enter Your Review"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                />

                            <div className='flex'>

                                <div className="flex mt-7 ml-3">
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

                                <div className="flex justify-end mr-3 w-[15rem] mt-5">
                                    <button
                                        className={`flex items-center bg-black text-white gap-1 px-4 py-2 cursor-pointer font-semibold tracking-widest rounded-md hover:bg-white duration-300 hover:gap-2 hover:translate-x-3 hover:text-black`}
                                        onClick={handleSubmit}
                                    >
                                        Send
                                        <svg
                                            className="w-5 h-5" 
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>

                            </div>

                            </div>






                            {message && <p className="text-white mt-2">{message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-start w-32">
                    <img src={logo} alt="Logo" className="w-24 h-auto" />
                </div>
                <div className='flex justify-center'>
                <p class="select-none text-xs ">
                    Alright, reserved for <strong>LunuMirisa</strong>
                </p>
            </div>
            </div>





        </footer>

    );
};

export default Footer;
