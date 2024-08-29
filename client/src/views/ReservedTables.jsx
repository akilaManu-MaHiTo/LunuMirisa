import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const ReservedTables = () => {
    
    const { id } = useParams();
    const [tables, setTables] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [eroor, setError] = useState('');
    
    const navigate = useNavigate();

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
      axios.post("http://localhost:3001/reservedtables", { quantity, price, tableNum,date,time })
        .then(result => {
          console.log(result);
          navigate('/AdminPage');
        })
        .catch(err => console.log(err));
    };
  
    return (
     
    
      <div className="flex items-center justify-center min-h-screen bg-gray-100">


        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Reservation</h2>

          <form onSubmit={handleSubmit}>
          <ul>

          {tables.map(table => (
            <li key={table._id} className="mb-4 p-4 border rounded shadow-sm">

              <div>
                
                <p>{`Table Number: ${table.tableNum}`}</p>
                <p>{`Quantity: ${table.quantity}`}</p>
                <p>{`Price: ${table.price}`}</p>
              </div>

              </li>
              ))}
              </ul>


            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                date
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
                time
              </label>
              <input
                type="number"
                id="time"
                step="0.01"
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
  