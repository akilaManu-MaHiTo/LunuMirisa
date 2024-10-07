import axios from 'axios';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavigationBar from './Components/NavigationBar.jsx'; 
import logo from '../Images/Logo.png';
import Footer from './Footer.jsx';
import bgtable from '../Images/table.jpg';


const ReservedTables = () => {
    const { reserveId,userId } = useParams(); // Extract the reserveId from the URL
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Assuming tableNum is known or passed as a prop. Change as needed.
    const tableNum = "1"; // Example table number

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if date and time are selected
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

        setError(''); // Clear previous error messages

        // Format the date and time correctly for the backend
        const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
        const formattedTime = selectedTime.toTimeString().split(' ')[0]; // Get time in HH:mm:ss format

        try {
            // Make an API call to update the reservation
            await axios.put(`http://localhost:3001/updateReservedTable/${reserveId}`, {
                date: formattedDate,  // Send the formatted date
                time: formattedTime,  // Send the formatted time
                tableNum,             // Include the table number
            });

            setSuccess('Reservation updated successfully!');
            setError('');

            // Optionally navigate to another page after success
            navigate(`/MyTableReservations/${userId}`); // Uncomment and change if you want to redirect after success
        } catch (err) {
            // Handle errors
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
    <div>
        <NavigationBar logo={logo} />
        
        <div className="flex justify-center min-h-screen"
                style={{ 
                    backgroundImage: `url(${bgtable})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  }}
        >
            <div className="w-[35rem] mb-20  p-10 relative justify-center z-10 bg-custom-gray opacity-90 mt-20 rounded-lg shadow-md">
                <h2 className="text-3xl text-center font-light mb-4 text-white">Update Reservation</h2>

                <p className='text-lg text-white mt-10 font-thin ml-2'>Need to make changes to your existing reservation? No problem! Use the form below to update your reservation details, and we’ll ensure everything is adjusted accordingly.</p>



                <form onSubmit={handleSubmit}>
                <div className="mb-4 flex space-x-4 mt-16">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-white">Date</label>
                        <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholderText="Select Date"
                        dateFormat="yyyy/MM/dd"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-white">Time</label>
                        <DatePicker
                        selected={selectedTime}
                        onChange={(time) => setSelectedTime(time)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    </div>


                    <div className='flex justify-center mt-10'>
                            <button
                                type="submit"
                                className="w-56 h-12 mt-10 text-lg border border-white bg-black text-white py-2 px-4 rounded-md hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 ease-in-out transform  "
                            >
                                Book Reservation
                            </button>
                        </div>

                    <div className='mt-5 flex justify-center'> 
                        {error && <div className="text-red-600 mb-4">{error}</div>}
                        {success && <div className="text-green-600 mb-4">{success}</div>
                    }</div>
                    
                </form>
            </div>
        </div>
        <Footer />    
    </div>
    );
};

export default ReservedTables;
