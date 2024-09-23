import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateReservation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState({
        quantity: '',
        price: '',
        tableNum: '',
        date: '',
        time: '',
        userId: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the current reservation details
        axios.get(`http://localhost:3001/reservations/${id}`)
            .then(result => {
                setReservation(result.data);
            })
            .catch(err => setError("Error fetching reservation details."));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservation({ ...reservation, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update the reservation
        axios.put(`http://localhost:3001/reservations/${id}`, reservation)
            .then(() => {
                navigate('/reservations'); // Navigate back to the reservations page
            })
            .catch(err => setError("Error updating reservation."));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Update Reservation</h2>
            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={reservation.quantity}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={reservation.price}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Table Number</label>
                    <input
                        type="text"
                        name="tableNum"
                        value={reservation.tableNum}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={reservation.date}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                    <input
                        type="time"
                        name="time"
                        value={reservation.time}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">User ID</label>
                    <input
                        type="text"
                        name="userId"
                        value={reservation.userId}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Update Reservation
                </button>
            </form>
        </div>
    );
};

export default UpdateReservation;
