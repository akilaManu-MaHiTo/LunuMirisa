import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Components/NavigationBar.jsx';
import logo from '../Images/Logo.png';
import ProfilePic from './Components/ProfilePic.jsx';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';


function UpdateUsers() {
    const { userId } = useParams();
    const [firstName, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/getUser/${userId}`)
            .then(result => {
                setName(result.data.firstName || '');
                setlastName(result.data.lastName || '');
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

    const Update = (e) => {
        e.preventDefault();
        if (!firstName || !email || !age) {
            alert('Please fill out all fields');
            return;
        }

        axios.put(`http://localhost:3001/updateUser/${userId}`, { name, email, age })
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
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-[#3b3838]">
                <div className="w-full sm:w-1/2 bg-custom-light p-6 sm:p-8 rounded-md shadow-md mt-16">
                    <form onSubmit={Update}>
                        <h2 className="font-spartan text-center text-4xl text-white mb-4">Your Profile</h2>

                        <div className="container mx-auto p-8">
                            <ProfilePic />  {}

                            <h1 className="font-spartan font-thin text-4xl text-white text-center mb-8 mt-6">
                                <div className='flex justify-center items-center space-x-1'>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder=""
                                            className="bg-transparent border-none text-white focus:outline-none text-center w-32"
                                            value={firstName}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                    <input
                                        type="text"
                                        placeholder=""
                                        className="bg-transparent border-none text-white focus:outline-none text-center  w-32"
                                        value={lastName}
                                        onChange={(e) => setlastName(e.target.value)}
                                    />
                                    </div>
                                </div>
                                <small className="font-bold text-orange-300 text-xl mt-2 items-center ">
                                    <FontAwesomeIcon icon={faCrown} className="text-orange-300 mr-2" />
                                    Premium
                                </small>


                            </h1>
                        </div>

                        <div className="mb-4">
                            <label className="block text-center mb-1">E-mail</label>
                            <input
                                type=""
                                placeholder="Enter email"
                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                             readOnly/>
                        </div>

                        <div className="mb-4">
                            <label className="block text-center mb-1">Age</label>
                            <input
                                type="number"
                                placeholder="Enter Age"
                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateUsers;
