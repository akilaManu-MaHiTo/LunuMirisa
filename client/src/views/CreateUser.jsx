import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const CreateUsers = () => {

    const[name,setName] = useState();
    const[email,setEmail] = useState();
    const[age,setAge] = useState();
    const[password,setPassword] = useState();
    const navigate = useNavigate();

    const Submit = (e) => {

        e.preventDefault();
        axios.post("http://localhost:3001/createUser",{name,email,age,password})
        .then(result => {

            console.log(result)
            navigate('/') 

        })            
        .catch(err => console.log(err))

    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-600'>
            <div className='w-full sm:w-1/2 bg-white p-6 sm:p-8 rounded-md shadow-md'>
                <form onSubmit={Submit}>

                    <h2>Add User</h2><br /><br />

                    <div>
                        <label className='block text-center mb-1'>Name</label>
                        <input type="text" placeholder='Enter Name' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div>
                        <label className='block text-center mb-1'>E-mail</label>
                        <input type="email" placeholder='Enter email' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div>
                        <label className='block text-center mb-1'>Age</label>
                        <input type="Number" placeholder='Enter Age' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setAge(e.target.value)}/>
                    </div>

                    <div>
                        <label className='block text-center mb-1'>Password</label>
                        <input type="Number" placeholder='Enter Age' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <button type="submit">Submit</button>

                </form>

            </div>

            <Link to="/">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer' style={{ width: '400px' }}>
                    User Page
                </button>                    
            </Link>

        </div>
    );
};

export default CreateUsers;
