import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/loginUser', { email, password });

      if (response.status === 200) {
        const userId = response.data.userId;
        navigate(`/UserHome/${userId}`); // Pass userId in the URL

      } else if (response.status === 201) {
        const userId = response.data.emId;
        navigate(`/AdminPage/${userId}`);

      } else if (response.status === 202 || response.status === 203 || response.status === 204) {
        alert('Employee login successful');
      }

    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-600'>
      <div className='w-full sm:w-1/2 bg-white p-6 sm:p-8 rounded-md shadow-md'>
        <form onSubmit={Submit}>
          <h2 className='text-center text-2xl mb-6'>Login</h2>
          <div className='mb-4'>
            <label className='block text-center mb-2'>E-mail</label>
            <input
              type="email"
              placeholder='Enter email'
              className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-center mb-2'>Password</label>
            <input
              type="password"
              placeholder='Enter password'
              className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginUser;
