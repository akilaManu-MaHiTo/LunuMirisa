import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import NavigationBar from './Components/NavigationBar.jsx'; 
import logo from '../Images/Logo.png';
import Footer from './Footer.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import bgtableform from '../Images/table-R-BG.jpg';

const ReservedTables = () => {
    const { id, userId } = useParams(); // Extract both table ID and user ID
    const navigate = useNavigate();
    const [tableNum, setTableNum] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');

    // Fetch user's email
    useEffect(() => {
        axios.get(`http://localhost:3001/getUser/${userId}`)
            .then((response) => {
                setEmail(response.data.email);
                console.log(response.data.email);
            })
            .catch((err) => {
                setError("Error fetching user data.");
                console.log(err);
            });
    }, [userId]);

    // Fetch table details
    useEffect(() => {
        axios.get(`http://localhost:3001/getTable/${id}`)
            .then(result => {
                setTableNum(result.data.tableNum);
                setQuantity(result.data.quantity);
                setPrice(result.data.price);
            })
            .catch(err => {
                setError("Error fetching table data.");
                console.log(err);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!selectedDate || !selectedTime) {
            setError("Please select a date and time.");
            return;
        }
    
        const currentDate = new Date();
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(selectedTime.getHours());
        selectedDateTime.setMinutes(selectedTime.getMinutes());
    
        // Check if the selected date and time are in the past
        if (selectedDateTime < currentDate) {
            setError("You cannot reserve a table in the past.");
            return;
        }
    
        const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
        const formattedTime = selectedTime.toTimeString().split(' ')[0];
    
        // Check for existing reservation
        axios.post("http://localhost:3001/checkReservation", {
            date: formattedDate, // Use formatted date
            time: formattedTime, // Use formatted time
            tableNum
        })
        .then(res => {
            if (res.data.exists) {
                setError("This table is already reserved for the selected date and time. Please choose another time or date.");
            } else {
                // Proceed with reservation
                axios.post("http://localhost:3001/reservedtables", {
                    quantity,
                    price,
                    tableNum,
                    date: formattedDate, // Use formatted date
                    time: formattedTime, // Use formatted time
                    userId, // use the userId from the URL
                    email
                })
                .then(result => {
                    setSuccess("Reservation successful!");
                    setTimeout(() => {
                        navigate(`/TableReservationPage/${userId}`);
                    }, 2000);
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    };
    

    return (
        <div>
            <NavigationBar logo={logo} />
            <div className="relative flex justify-center min-h-screen bg-gray-100"
                style={{ 
                    backgroundImage: `url(${bgtableform})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black opacity-75"></div>

                <div className="w-[35rem] mb-20  p-10 relative justify-center z-10 bg-custom-gray opacity-90 mt-20 rounded-lg shadow-md">
                    <h2 className="text-4xl mb-10 text-center font-light text-white">Book Your Reservation</h2>

                    <p className='mb-3 font-spartan text-white font-thin text-lg'>
                    Planning a visit to experience our authentic Sri Lankan flavors? Secure your table with just a few clicks!
                    Please provide your preferred <strong>date and time</strong>  for the reservation, and we’ll make sure everything is ready for your perfect dining experience.
                    </p>

                    <p className='text-white font-thin font-spartan mb-10'>
                    <strong className='mb-2'>Reservation Details:</strong>
                    <p> <strong>Date:</strong> Choose the date of your visit to Lunumirisa.</p>
                    <p> <strong>Time:</strong> Let us know your preferred dining time.</p>
                    <p> Once you’ve submitted your details, our team will confirm your reservation shortly.</p>

                    </p>



                    <form onSubmit={handleSubmit} className=' justify-center w-full'>
                    <div className="flex space-x-4 justify-center items-center">
                        <div className="w-1/2 mb-4 ml-5">
                            <label className="block text-sm font-medium text-white">
                                Date
                            </label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white sm:text-sm"
                                placeholderText="Select Date"
                                dateFormat="yyyy/MM/dd"
                            />
                        </div>

                        <div className="w-1/2 mb-4">
                            <label className="block text-sm font-medium text-white">
                                Time
                            </label>
                            <DatePicker
                                selected={selectedTime}
                                onChange={(time) => setSelectedTime(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={60}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-white focus:border-white sm:text-sm"
                                minTime={new Date().setHours(8, 0)} // Set minimum time to 9:00 AM
                                maxTime={new Date().setHours(22, 0)} // Set maximum time to 10:00 PM
                                placeholderText="Select Time"
                            />
                        </div>
                    </div>

                        

                        

                        <div className='flex justify-center mt-10'>
                            <button
                                type="submit"
                                className="w-56 h-12 text-lg bg-black text-white py-2 px-4 rounded-md hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 ease-in-out transform  "
                            >
                                Book Reservation
                            </button>
                        </div>

                        
                        <div className='mt-6 flex justify-center'>
                            {error && <div className="text-red-600">{error}</div>}
                            {success && <div className="text-green-600">{success}</div>}
                        </div>
                    </form>
                </div>
            </div>


            <Footer />
        </div>
    );
};

export default ReservedTables;
