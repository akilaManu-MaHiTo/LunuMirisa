import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,Link  } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Components/NavigationBar.jsx';
import logo from '../Images/Logo.png';
import defaultProfilePic from '../Images/profile-picture.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUser, faPenNib, faEnvelope, faPhone, faLocationDot, faPenAlt, faCircleNotch, faTrashCan, faSave } from '@fortawesome/free-solid-svg-icons';
import bgprofile from '../Images/profileBG2.jpg';
import Footer from './Footer.jsx';
import Loader from './Components/Loader.jsx';

function UpdateUsers() {
    const { userId } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({});
    const [reviews, setReviews] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/getUser/${userId}`)
            .then(result => {
                setFirstName(result.data.firstName || '');
                setLastName(result.data.lastName || '');
                setEmail(result.data.email || '');
                setPhone(result.data.phone || '');
                setAddress(result.data.address || '');
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch user data');
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        axios.get(`http://localhost:3001/ShowProfilePic/${userId}`)
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the profile picture!', error);
                setError('There was an error fetching the profile picture!');
            });
    }, [userId]);

    useEffect(() => {
        axios.get(`http://localhost:3001/GetAllReviewsbyId/${userId}`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error(error);
                setError('Failed to fetch reviews');
            });
    }, [userId]);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);
        setPreviewImage(URL.createObjectURL(selectedFile));
    };

    const validateForm = () => {
        const errors = {};

        if (!firstName.trim()) {
            errors.firstName = 'First name is required.';
        }

        if (!lastName.trim()) {
            errors.lastName = 'Last name is required.';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailPattern.test(email)) {
            errors.email = 'A valid email is required.';
        }

        const phonePattern = /^\d+$/;
        if (phone && (!phonePattern.test(phone) || phone.length < 10)) {
            errors.phone = 'A valid phone number is required.';
        }

        return errors;
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);

        const updatedUserData = {
            firstName,
            lastName,
            phone,
            address,
        };

        const formData = new FormData();
        if (image) {
            formData.append('image', image);
        }
        formData.append('userId', userId);

        axios.post("http://localhost:3001/ProfileImage", formData)
            .then(result => {
                if (result.data.alreadyExists) {
                    return axios.put("http://localhost:3001/ProfileImage", formData);
                }
            })
            .then(() => {
                return axios.put(`http://localhost:3001/updateUser/${userId}`, updatedUserData);
            })
            .then(() => {
                navigate(`/UserHome/${userId}`);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to update user data');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmDelete) {
            axios.delete(`http://localhost:3001/deleteUser/${userId}`)
                .then(() => {
                    navigate('/');
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to delete the account');
                });
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <Navigation logo={logo} />
            <div
                style={{ 
                    backgroundImage: `url(${bgprofile})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            >
                <div className="flex justify-center items-center min-h-screen">
                    <div className="w-full sm:w-1/2 bg-custom-light bg-opacity-70 p-6 sm:p-8 rounded-md shadow-md mt-16 mb-10">
                        <form onSubmit={handleUpdate}>
                            <h2 className="text-center text-4xl font-semibold text-white mb-4">Your Profile</h2>
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center w-30">
                                    <div className="relative w-40 h-40">
                                        <img 
                                            src={previewImage || (profile.image ? `http://localhost:3001/Images/${profile.image}` : defaultProfilePic)} 
                                            alt="Profile" 
                                            className="w-full h-full bg-cover bg-center rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl"
                                        />
                                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 flex items-center justify-center">
                                            <input 
                                                type="file" 
                                                id="imageUpload" 
                                                accept=".png, .jpg, .jpeg" 
                                                onChange={handleImageChange}
                                                className="hidden" 
                                            />
                                            <label 
                                                htmlFor="imageUpload" 
                                                className="flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={faPenAlt} 
                                                    className="text-black text-[1rem] bg-white p-2 rounded-full hover:bg-blue-500 mb-10 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white" 
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
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
                                            className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none focus:ring-0"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    {validationErrors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xl text-gray-100 font-thin mb-3">Last Name</label>
                                    <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                        <FontAwesomeIcon icon={faPenNib} className="w-4 h-4 ml-4 text-black" />
                                        <input
                                            type="text"
                                            placeholder="Enter your last name"
                                            className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none focus:ring-0"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    {validationErrors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <label className="block text-xl text-gray-100 font-thin mb-3">Email</label>
                                    <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 ml-4 text-black" />
                                        <input
                                            type="text"
                                            placeholder="Enter your email"
                                            className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none focus:ring-0"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        readOnly/>
                                    </div>
                                    {validationErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xl text-gray-100 font-thin mb-3">Phone</label>
                                    <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                        <FontAwesomeIcon icon={faPhone} className="w-4 h-4 ml-4 text-black" />
                                        <input
                                            type="text"
                                            placeholder="Enter your phone number"
                                            className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none focus:ring-0"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    {validationErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-xl text-gray-100 font-thin mb-3">Address</label>
                                <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                    <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 ml-4 text-black" />
                                    <input
                                        type="text"
                                        placeholder="Enter your address"
                                        className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none focus:ring-0"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            )}

                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    className="py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform bg-white text-black hover:bg-black hover:text-white hover:scale-105" >                                                                    
                                        <FontAwesomeIcon icon={faSave} className="w-5 h-5 mr-2" />Save Changes
                                </button>
                            </div>
                        </form>

                        <div className="relative">

                        </div>
                    </div>
                </div>
                <div className='flex h-80 justify-center mb-10' >
                    <div className=' w-1/2 justify-center items-center bg-custom-light bg-opacity-70 rounded-xl'>
                        <h2 className='text-3xl text-white mt-10 ml-5 font-spartan font-thin'>Your Reviews</h2>

                        <p className='text-white mt-5 ml-10 w-[40rem] font-spartan text-lg '> Easily take control of all your customer feedback with our streamlined review management system. Whether you're looking to update a review, edit the details, or delete an outdated comment, we've got you covered. With just a few clicks</p>

                        <div className="flex justify-end mt-10 mr-10">

                        <Link to={`/ShowUserReviews/${userId}`}>

                        <button class="bg-black border border-white hover:bg-white text-white font-bold py-3 px-6 shadow-lg shadow-neutral-950 hover:text-black transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
                        See Reveiws
                        </button>


                        </Link>

                        </div>
                    </div>
                </div>
                
                <div className='flex h-72 justify-center mb-20' >
                    <div className=' w-1/2 justify-center items-center bg-custom-light bg-opacity-70 rounded-xl'>

                    <h2 className='text-3xl text-red-400 mt-10 ml-5 font-spartan font-light'> Deactivate Account </h2>

                    <p className='text-white mt-5 ml-10 w-[40rem] font-spartan text-lg'>
                    <strong>We're Sorry to See You Go</strong> We understand that this is a big decision. If you have any feedback or need assistance, we’re here to help.
                    </p>



                        <div className='flex justify-end mr-10 mt-14'>
                            <button
                                    onClick={handleDeleteAccount}
                                    className=" bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out transform"
                                >
                                    <FontAwesomeIcon icon={faTrashCan} className='mr-2' /> Deactivate Account

                            </button>
                        </div>

                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}

export default UpdateUsers;
