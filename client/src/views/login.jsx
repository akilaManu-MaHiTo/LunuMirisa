import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from './Components/NavigationSignup.jsx';
import Footer from './Footer.jsx'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png';
import at from '../Images/at.svg';
import lock from '../Images/lock.svg';
import loginBG from '../Images/loginBG.jpg';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/loginUser', { email, password });
      switch (response.status) {
        case 200:
          navigate(`/UserHome/${response.data.userId}`);
          break;
        case 201:
          navigate('/AdminPage');
          break;
        case 202:
        case 203:
        case 204:
          alert('Employee login successful');
          break;
        default:
          alert('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Navigation logo={logo} />
      <div className='flex justify-center items-center min-h-screen bg-custom-dark w-screen'>
        <div className='flex w-full sm:w-3/4 bg-white shadow-md mt-16 mb-40'>
          {/* Form Container */}
          <div className='w-full sm:w-1/2 p-6 sm:p-8 mt-16'>
            <form onSubmit={Submit}>
              <h2 className='text-center text-black font-spartan font-semibold text-[4rem] mb-10'>Login</h2>
              <div className='mb-4'>
                <div className="flex flex-col mb-4">
                  <label className="text-gray-700 mb-2">Email</label>
                  <div className="flex items-center border border-gray-300 rounded-md p-2 transition-colors duration-300 hover:border-black">
                    <img src={at} alt="Email Icon" className="text-gray-500 mr-2 ml-2 w-5 h-5" />
                    <input
                      placeholder="Enter your Email"
                      className="flex-1 border-none outline-none px-2 py-1 text-gray-800"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-gray-700 mb-2">Password</label>
                <div className="flex items-center border border-gray-300 rounded-md p-2 transition-colors duration-300 hover:border-black">
                  <img src={lock} alt="Password Icon" className="text-gray-500 mr-2 ml-2 w-5 h-5" />
                  <input
                    placeholder="Enter your Password"
                    className="flex-1 border-none outline-none px-2 py-1 text-gray-800"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="ml-2"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-10 py-2 px-4 bg-black text-white rounded-md shadow-sm duration-300 hover:bg-gray-800 hover:scale-105"
              >
                Submit
              </button>
            </form>
            <div className='flex justify-center mt-4'>
              <a
                href='./CreateUser'
                className="py-2 px-4 text-black rounded-md shadow-sm duration-300 inline-block"
              >
                Create New Account
              </a>
            </div>

          </div>
          
          <div
            className='hidden sm:block w-8/12 h-screen relative'
            style={{ 
              backgroundImage: `url(${loginBG})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          >
            {/* Dark Overlay */}
            <div className='absolute inset-0 bg-black opacity-70'></div>
            
            {/* Text Overlay */}
            <div className='relative flex justify-center items-center h-full'>
              <h2 className='text-white font-spartan font-thin text-5xl text-center px-20'>
                Ready for something delicious? Log in now.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginUser;
