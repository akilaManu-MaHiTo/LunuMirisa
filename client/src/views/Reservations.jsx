import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
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

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Reservations</h2>
            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Reservation ID</th>
                        <th className="py-3 px-6 text-left">User ID</th>
                        <th className="py-3 px-6 text-left">Quantity</th>
                        <th className="py-3 px-6 text-left">Price</th>
                        <th className="py-3 px-6 text-left">Table Number</th>
                        <th className="py-3 px-6 text-left">Date</th>
                        <th className="py-3 px-6 text-left">Time</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {reservations.map(reservation => (
                        <tr key={reservation._id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6">{reservation._id}</td>
                            <td className="py-3 px-6">{reservation.userId}</td>
                            <td className="py-3 px-6">{reservation.quantity}</td>
                            <td className="py-3 px-6">{reservation.price}</td>
                            <td className="py-3 px-6">{reservation.tableNum}</td>
                            <td className="py-3 px-6">{reservation.date}</td>
                            <td className="py-3 px-6">{reservation.time}</td>
                            <td className="py-3 px-6 text-center">
                                <button
                                    onClick={() => handleUpdate(reservation._id)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 mr-2"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(reservation._id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
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
