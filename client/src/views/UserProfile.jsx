import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateUsers() {

    const {userId} = useParams()
    const[name,setName] = useState();
    const[email,setEmail] = useState();
    const[age,setAge] = useState();
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get('http://localhost:3001/getUser/'+userId)
            .then(result => {console.log(result)

                setName(result.data.name)
                setEmail(result.data.email)
                setAge(result.data.age)


            })
            .catch(err => console.log(err));
    }, []);

    const Update = (e) => {

        e.preventDefault()
        axios.put("http://localhost:3001/updateUser/"+id,{name,email,age})
        .then(result => {

            console.log(result)
            navigate('/') 

        })            
        .catch(err => console.log(err))
    }
    
  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-600'>
        <div className='w-full sm:w-1/2 bg-white p-6 sm:p-8 rounded-md shadow-md'>
            <form onSubmit={Update}>

                <h2>Update User Details</h2><br /><br />

                <div>
                    <label className='block text-center mb-1'>Name</label>
                    <input type="text" placeholder='Enter Name' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                    value={name} onChange={(e) => setName(e.target.value)}/>
                    
                </div>

                <div>
                    <label className='block text-center mb-1'>E-mail</label>
                    <input type="email" placeholder='Enter email' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div>
                    <label className='block text-center mb-1'>Age</label>
                    <input type="Number" placeholder='Enter Age' className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500'
                    value={age} onChange={(e) => setAge(e.target.value)}/>
                </div>

                <button type="submit">Submit</button>
                
            </form>
        </div>
    </div>
  );
};

export default UpdateUsers;
