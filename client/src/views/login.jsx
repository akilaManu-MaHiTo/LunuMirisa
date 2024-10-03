import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from './Components/NavigationSignup.jsx';
import Footer from './Footer.jsx'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png';
import at from '../Images/at.svg';
import lock from '../Images/lock.svg';
import loginBG from '../Images/loginBG.jpg';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const Submit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading animation
    try {
      const response = await axios.post('http://localhost:3001/loginUser', { email, password });
      
      console.log('Response Data:', response.data); // Debugging log

      switch (response.status) {
        case 200:
          navigate(`/UserHome/${response.data.userId}`);
          break;
        case 201:
          navigate('/AdminPage');
          break;
        case 202:
          navigate(`/InOrder/${response.data.userId}`);
          break;
        case 203:
          navigate(`/ChefPage/${response.data.userId}`);
          break;
        case 204:
          alert('Employee login successful');
          break;
        case 206:
          console.log(response.data.SupplierId)
          navigate(`/SupplierDashboard/${response.data.SupplierId}`); // Updated navigation
          break;
        default:
          alert('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Stop loading animation
    }
  }, [email, password, navigate]);
  
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <div>
      <Navigation logo={logo} />
      <div className='flex justify-center items-center min-h-screen bg-[#1A0E0E] w-screen'>
        <div className='flex w-full sm:w-3/4 bg-white shadow-md mt-10 mb-40'>
          <div className='w-full sm:w-1/2 p-6 sm:p-8 mt-10'>
            <form onSubmit={Submit}>
              <h2 className='text-center text-black font-spartan font-semibold text-[4rem] mb-10'>Login</h2>
              <div className='mb-4'>
                <div className="flex flex-col mb-4">
                  <label className="text-gray-700 mb-2" htmlFor="email">Email</label>
                  <div className="flex items-center border border-gray-300 rounded-md p-2 transition-colors duration-300 hover:border-black">
                    <img src={at} alt="Email Icon" className="text-gray-500 mr-2 ml-2 w-5 h-5" />
                    <input
                      id="email"
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
                <label className="text-gray-700 mb-2" htmlFor="password">Password</label>
                <div className="flex items-center border border-gray-300 rounded-md p-2 transition-colors duration-300 hover:border-black">
                  <img src={lock} alt="Password Icon" className="text-gray-500 mr-2 ml-2 w-5 h-5" />
                  <input
                    id="password"
                    placeholder="Enter your Password"
                    className="flex-1 border-none outline-none px-2 py-1 text-gray-800"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-describedby={error ? 'password-error' : null}
                    aria-invalid={error ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    className="ml-2"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
              {error && <div id="password-error" className="text-red-500 text-sm mb-4">{error}</div>}
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="w-64 mt-10 py-2 px-4 bg-black text-white rounded-md shadow-sm duration-300 hover:bg-white hover:border hover:border-black hover:text-black hover:scale-105 flex justify-center items-center"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="w-5 h-5" />
                  ) : (
                    'Log In'
                  )}
                </button>
              </div>
            </form>
            <div className="flex justify-center text-gray-700 pt-4 font-spartan items-center">
              <div className="font-thin text-center">
                Don't have an account?&nbsp;&nbsp;
              </div>
              <Link to="/create">
                <button className="font-bold hover:underline">
                  Sign Up
                </button>
              </Link>
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
            <div className='absolute inset-0 bg-black opacity-70'></div>
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
