import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Components/NavigationBar.jsx';
import logo from '../Images/Logo.png';
import ProfilePic from './Components/ProfilePic.jsx';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUser, faPenNib, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import bgprofile from '../Images/profileBG2.jpg'
import Footer from './Footer.jsx';

function UpdateUsers() {
    const { userId } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/getUser/${userId}`)
            .then(result => {
                setFirstName(result.data.firstName || '');
                setLastName(result.data.lastName || '');
                setEmail(result.data.email || '');
                setAge(result.data.age || '');
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch user data');
                setLoading(false);
            });
    }, [userId]);

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!firstName || !email || !age) {
            alert('Please fill out all fields');
            return;
        }

        axios.put(`http://localhost:3001/updateUser/${userId}`, { firstName, lastName, email, age })
            .then(result => {
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                setError('Failed to update user data');
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navigation logo={logo} />
            <div
					className=""
					style={{ 
						backgroundImage: `url(${bgprofile})`, 
						backgroundSize: 'cover', 
						backgroundPosition: 'center' 
					}}
					>
					{}
            <div className="flex justify-center items-center min-h-screen">
            <div className="w-full sm:w-1/2 bg-custom-toolight bg-opacity-70 p-6 sm:p-8 rounded-md shadow-md mt-16 mb-40">

                    <form onSubmit={handleUpdate}>
                        <h2 className="text-center text-4xl font-semibold text-white mb-4">Your Profile</h2>
                        
                        <div className="text-center mb-8">
                            <ProfilePic />
                            <h1 className="text-4xl font-thin text-white mt-6 mb-2">
                                <span className='flex justify-center items-center space-x-1'>
                                    {firstName} {lastName}
                                </span>
                                <small className="font-bold text-orange-300 text-xl mt-2 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCrown} className="text-orange-300 mr-2" />
                                    Premium
                                </small>
                            </h1>
                        </div>

                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-xl text-gray-100 font-thin mb-3">First Name</label>
                                <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 ml-4 text-black" />
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-xl text-gray-100 font-thin mb-3">Last Name</label>
                                <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                    <FontAwesomeIcon icon={faPenNib} className="w-4 h-4 ml-4 text-black" />
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 mt-3">
                            <label className="block text-xl text-gray-100 font-thin mb-3">E-mail</label>
                            <div className="flex items-center rounded-lg h-12 bg-white transition duration-200 ease-in-out focus-within:border-black">
                                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 ml-4 text-black" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                    value={email}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xl text-gray-100 font-thin mb-3">Phone Number</label>
                            <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 ml-4 text-black" />
                                <input
                                    type="number"
                                    placeholder="Enter your Phone Number"
                                    className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xl text-gray-100 font-thin mb-3">Address</label>              
                            <div className="flex items-center rounded-lg h-12 bg-white focus-within:border-black transition-all duration-300 ease-in-out transform hover:scale-105">              
                            <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 ml-4 text-black" />
                            <input
                                placeholder="Enter street address"
                                type="text"
                                className="relative h-10 w-full outline-none text-[#808080] mt-1 rounded-lg px-3 bg-white text-base"
                            />
                            </div>
                            <div className="flex gap-4 mt-2">
                            <div className="flex-1">
                                <div class="relative group bg-white rounded-lg h-12 transition-all duration-300 ease-in-out transform hover:scale-105">
                                
                                <a href="#" className="flex items-center justify-center gap-3 py-3 px-9 rounded-xl text-black  bg-transparent transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-black">
                                    <span>Province</span>
                                    <svg className="w-4 h-4 transition-transform duration-500 ease-in-out group-hover:rotate-180" viewBox="0 0 360 360" xml:space="preserve">
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                        id="XMLID_225_"
                                        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                                        ></path>
                                    </g>
                                    </svg>
                                </a>
                                <div class="absolute left-0 top-full hidden flex-col items-center w-full rounded-lg border border-gray-300 bg-white opacity-0 transform translate-y-4 group-hover:flex group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">Central Province</a>
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">Western Province</a>
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">Northern Province</a>
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">North Western Province</a>
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">Sabaragamuwa Province</a>
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">Eastern Province</a>
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">Uva Province</a>
                                <a href="#" className="w-full py-3 px-6 text-center text-black hover:bg-blue-600 hover:text-white transition-all duration-500 ease-in-out">Southern Province</a>

                                </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <input
                                    placeholder="Enter your city"
                                    type="text"
                                    className="relative h-10 w-full outline-none h-12 text-[#808080] rounded-lg px-3 bg-white text-base transition-all duration-300 ease-in-out transform hover:scale-105"
                                />
                            </div>
                        </div>

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 mt-10 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
            </div>
        </div>
    );
}

export default UpdateUsers;
