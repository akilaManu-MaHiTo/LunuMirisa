import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddTables = () => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [tableNum, setTableNum] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/createTable", { quantity, price, tableNum })
        .then(result => {
            console.log(result);
            navigate('/Updatetable');
        })
        .catch(err => {
            if (err.response && err.response.status === 400) {
                alert("Table number already exists");
                // You can display the error to the user here, e.g., using a state variable to show an error message
            } else {
                console.log(err);
            }
        });
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add Table Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              No Of Person
            </label>
            <input
              type="number"
              id="quantity"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter number of persons"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Reservation Price
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter reservation price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="tableNum" className="block text-sm font-medium text-gray-700">
              Table Number
            </label>
            <input
              type="text"
              id="tableNum"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter table numbers"
              value={tableNum}
              onChange={(e) => setTableNum(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Add Table
          </button>
          
          <Link to="/Updatetable">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Update Table
                </button>
            </Link>
        </form>
      </div>
    </div>
  );
};

export default AddTables;
