import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReservedTables = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tableNum, setTableNum] = useState('');
    const [quantity, setQuantity] = useState(''); 
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3001/getTable/${id}`)
            .then(result => {
                setTableNum(result.data.tableNum);
                setQuantity(result.data.quantity);
                setPrice(result.data.price);
            })
            .catch(err => setError("Error fetching table data."));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for existing reservation
        axios.post("http://localhost:3001/checkReservation", { date, time, tableNum })
            .then(res => {
                if (res.data.exists) {
                    setError("This table is already reserved for the selected date and time. Please choose another time or date.");
                } else {
                    // Proceed with reservation
                    axios.post("http://localhost:3001/reservedtables", {
                        quantity,
                        price,
                        tableNum,
                        date,
                        time,
                        userId: id
                    })
                    .then(result => {
                        setSuccess("Reservation successful!");
                        setTimeout(() => {
                            navigate(`/TableReservationPage/${id}`);
                        }, 2000);
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Reservation</h2>

                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="text"
                            id="date"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                            Time
                        </label>
                        <input
                            type="text"
                            id="time"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter Time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Done
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReservedTables;
