import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filterQuantity, setFilterQuantity] = useState(''); 
    const [filterDate, setFilterDate] = useState(''); 
    const [filterTime, setFilterTime] = useState('');  
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        // Fetch all reservations
        axios.get('http://localhost:3001/reservations')
            .then(result => {
                setReservations(result.data);
            })
            .catch(err => setError("Error fetching reservations."));
    }, []);

    const handleDelete = (id) => {
        // Delete reservation
        axios.delete(`http://localhost:3001/reservations/${id}`)
            .then(() => {
                setReservations(reservations.filter(reservation => reservation._id !== id));
            })
            .catch(err => setError("Error deleting reservation."));
    };

    const handleUpdate = (id) => {
        // Navigate to the update form with the reservation ID
        navigate(`/updateReservation/${id}`);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Reservations Report', 14, 16);
        doc.autoTable({
            startY: 20,
            head: [['Reservation ID', 'User ID', 'Quantity', 'Price', 'Table Number', 'Date', 'Time']],
            body: reservations.map(reservation => [
                reservation._id,
                reservation.userId,
                reservation.quantity,
                reservation.price,
                reservation.tableNum,
                reservation.date,
                reservation.time
            ]),
        });
        doc.save('reservations.pdf');
    };

    const filteredReservations = reservations.filter(reservation =>
        (reservation._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) || // Added email filter
        reservation.tableNum.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterQuantity === '' || reservation.quantity.toString() === filterQuantity) &&
        (filterDate === '' || reservation.date === filterDate) && // Filter by date
        (filterTime === '' || reservation.time.slice(0, 5) === filterTime) // Filter by formatted time
    );
    
    
    // Generate time options with 15-minute intervals (e.g., 13:00, 13:15, 13:30)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour < 10 ? `0${hour}` : hour}:${minute === 0 ? '00' : minute}`;
                times.push(timeString);
            }
        }
        return times;
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-white">Reservations</h2>
            {error && <div className="text-red-400 mb-4 text-center font-medium">{error}</div>}

            {/* Search bar */}
            <div className="mb-4 text-center">
                <input
                    type="text"
                    placeholder="Search by Reservation ID, User ID, or Table Number"
                    className="p-4 border border-gray-600 rounded-md shadow-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Quantity filter */}
            <div className="mb-4 text-center">
                <input
                    type="number"
                    placeholder="Filter by Quantity"
                    className="p-4 border border-gray-600 rounded-md shadow-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterQuantity}
                    onChange={(e) => setFilterQuantity(e.target.value)}
                />
            </div>

            {/* Date filter */}
            <div className="mb-4 text-center">
                <input
                    type="date"
                    className="p-4 border border-gray-600 rounded-md shadow-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {/* Time filter */}
            <div className="mb-4 text-center">
                <select
                    className="p-4 border border-gray-600 rounded-md shadow-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                >
                    <option value="">Filter by Time</option>
                    {generateTimeOptions().map(time => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>

            {/* Download PDF button */}
            <div className="mb-6 text-center">
                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Download PDF
                </button>
            </div>

            <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-700 text-gray-200 uppercase text-sm leading-normal">
                        <th className="py-4 px-6 text-left">Reservation ID</th>
                        <th className="py-4 px-6 text-left">User ID</th>
                        <th className="py-4 px-6 text-left">User Email</th>
                        <th className="py-4 px-6 text-left">Quantity</th>
                        <th className="py-4 px-6 text-left">Price</th>
                        <th className="py-4 px-6 text-left">Table Number</th>
                        <th className="py-4 px-6 text-left">Date</th>
                        <th className="py-4 px-6 text-left">Time</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300 text-sm font-light">
                    {filteredReservations.map(reservation => (
                        <tr key={reservation._id} className="border-b border-gray-600 hover:bg-gray-700 transition duration-200">
                            <td className="py-3 px-6">{reservation._id}</td>
                            <td className="py-3 px-6">{reservation.userId}</td>
                            <td className="py-3 px-6">{reservation.email}</td>
                            <td className="py-3 px-6">{reservation.quantity}</td>
                            <td className="py-3 px-6">{reservation.price}</td>
                            <td className="py-3 px-6">{reservation.tableNum}</td>
                            <td className="py-3 px-6">{reservation.date}</td>
                            <td className="py-3 px-6">
                                {reservation.time.slice(0, 5)} {/* This will show "13:00" */}
                            </td>

                            <td className="py-3 px-6 text-center">
                                {/* <button
                                    onClick={() => handleUpdate(reservation._id)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-blue-600 transition duration-300 mr-2"
                                >
                                    Update
                                </button> */}
                                <button
                                    onClick={() => handleDelete(reservation._id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reservations;
