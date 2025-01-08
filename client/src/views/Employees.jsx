import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const createEmployees = () => {

    const[EmName,setName] = useState();
    const[email,setEmail] = useState();
    const[EmAge,setAge] = useState();
    const[EmPassword,setPassword] = useState();
    const[EmType,setType] = useState();
    const navigate = useNavigate();

    const Submit = (e) => {

        e.preventDefault();
        axios.post("https://lunu-mirisa.vercel.app/createEmployee",{EmName,email,EmAge,EmPassword,EmType})
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

                    <h2>Add Employee</h2><br /><br />

                    <div>
                        <label className='block text-center mb-1'>Employee Name</label>
                        <input type="text" placeholder='Enter Name' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div>
                        <label className='block text-center mb-1'>Employee E-mail</label>
                        <input type="email" placeholder='Enter email' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div>
                        <label className='block text-center mb-1'>Employee Age</label>
                        <input type="Number" placeholder='Enter Age' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setAge(e.target.value)}/>
                    </div>

                    <div>
                        <label className='block text-center mb-1'>Password</label>
                        <input type="Number" placeholder='Enter Age' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div>

                    <label className='block text-center mb-1'>Employee Role</label>
                    <select 
                        className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="Manager">Manager</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Viator">Viator</option>
                        <option value="Cheff">Cheff</option> 
                        <option value="Supplier">Supplier</option>                 
                    </select>
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

export default createEmployees;
