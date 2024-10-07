import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
    <div>
      <AdminNaviBar selectedPage="Add Table Details" />
      <Sidebar />   
      <div className="flex justify-center min-h-screen bg-gray-100"
          style={{ 
            backgroundImage: `url(${bgAdmin})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
          }}
      >
        <div className="bg-custom-toolight w-96 my-20 p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <h1 className='mb-10 text-2xl'>Add New Table</h1>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-black">
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
              <label htmlFor="price" className="block text-sm font-medium text-black">
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
              <label htmlFor="tableNum" className="block text-sm font-medium text-black">
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

            <div className='flex flex-col items-center'>
              <div className='mb-4'>
                <button
                  type="submit"
                  className="w-52 justify-center bg-black text-white p-3 mt-5 rounded-md hover:text-black hover:bg-white hover:border hover:border-black transition-all hover:scale-105 duration-300 ease-in-out"
                >
                  <FontAwesomeIcon icon={faPlus} className='mr-2' /> Add Table
                </button>
              </div>

              <div>
                <Link to="/Updatetable">
                  <button className='w-52 rounded bg-white hover:bg-black hover:text-white hover:cursor-pointer mt-2 p-3 transition-all hover:scale-105 duration-300 ease-in-out' >
                  <FontAwesomeIcon icon={faPlus} className='mr-2' /> Update Table
                  </button>
                </Link>
              </div>
            </div>

          </form>
            
        </div>
      </div>
    </div>
  );
};

export default AddTables;
