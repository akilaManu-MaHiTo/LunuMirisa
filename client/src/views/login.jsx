import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {


    const[email,setEmail] = useState();
    const[password,setPassword] = useState();
    const navigate = useNavigate();

    const Submit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3001/loginUser', { email, password });
          console.log('Response:', response.data);
          if (response.status === 200) {
            // Redirect to the user home page
            navigate('/UserHome')

          } else if (response.status === 201){

            navigate('/AdminPage')

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

                    <h2>Login</h2><br /><br />

                    <div>
                        <label className='block text-center mb-1'>E-mail</label>
                        <input type="email" placeholder='Enter email' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div>
                        <label className='block text-center mb-1'>Password</label>
                        <input type="Number" placeholder='Enter Age' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <button type="submit">Submit</button>

                </form>

            </div>

        </div>
    );
};

export default LoginUser;