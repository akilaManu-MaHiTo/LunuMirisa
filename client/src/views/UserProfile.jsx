import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateUsers() {
    const { userId } = useParams();
    const [name, setName] = useState('');  // Initialize to empty string
    const [email, setEmail] = useState('');  // Initialize to empty string
    const [age, setAge] = useState('');  // Initialize to empty string
    const navigate = useNavigate();
    console.log(`user id: ${userId}`);
    
    useEffect(() => {
        axios.get(`http://localhost:3001/getUser/${userId}`)
            .then(result => {
                console.log(result);
                setName(result.data.name || '');  // Ensure the value is not undefined
                setEmail(result.data.email || '');  // Ensure the value is not undefined
                setAge(result.data.age || '');  // Ensure the value is not undefined
            })
            .catch(err => console.log(err));
    }, [userId]);  // Added userId as a dependency

    const Update = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/updateUser/${userId}`, { name, email, age })
            .then(result => {
                console.log(result);
                navigate('/'); 
            })            
            .catch(err => console.log(err));
    };
    
    return (
        <div className='flex justify-center items-center min-h-screen bg-blue-600'>
            <div className='w-full sm:w-1/2 bg-white p-6 sm:p-8 rounded-md shadow-md'>
                <form onSubmit={Update}>
                    <h2 className='text-center text-2xl font-bold mb-4'>Update User Details</h2>

                    <div className='mb-4'>
                        <label className='block text-center mb-1'>Name</label>
                        <input 
                            type="text" 
                            placeholder='Enter Name' 
                            className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-center mb-1'>E-mail</label>
                        <input 
                            type="email" 
                            placeholder='Enter email' 
                            className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-center mb-1'>Age</label>
                        <input 
                            type="number" 
                            placeholder='Enter Age' 
                            className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                            value={age} 
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>

                    <button type="submit" className='w-full bg-blue-600 text-white py-2 rounded-md'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUsers;
