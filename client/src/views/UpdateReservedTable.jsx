import axios from 'axios';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservedTables = () => {
    const { reserveId } = useParams(); // Extract the reserveId from the URL
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
            navigate('/some-page'); // Uncomment and change if you want to redirect after success
        } catch (err) {
            // Handle errors
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Update Reservation</h2>

                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholderText="Select Date"
                            dateFormat="yyyy/MM/dd"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Time
                        </label>
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

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Update Reservation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReservedTables;
