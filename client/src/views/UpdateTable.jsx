import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const Updatetable = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios.get('https://lunu-mirisa.vercel.app/ShowTable')
      .then(result => setTables(result.data))
      .catch(err => console.log(err));
  }, []);

 

  const handleDelete = (id) => {
    axios.delete(`https://lunu-mirisa.vercel.app/DeleteTable/${id}`)
      .then(() => {
        setTables(tables.filter(table => table._id !== id));
        console.log(`Deleted table with id: ${id}`);
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <AdminNaviBar selectedPage="Add Table Details" />
      <Sidebar />  
      <div className="flex items-center justify-center min-h-screen bg-gray-100"
          style={{ 
            backgroundImage: `url(${bgAdmin})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
          }}
      >
        <div className="bg-custom-toolight p-8 rounded shadow-md w-[35rem] my-16">
          <div className='flex justify-between mb-10'>
            <div>
              <h1 className="text-3xl font-thin">Table List</h1>
            </div>
            <div>
              <Link to='/AddTables'>
                <button className='p-3 bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black rounded-lg transition-all hover:scale-105 duration-300 ease-in-out'> 
                <FontAwesomeIcon icon={faPlus} /> Add Table 
                </button>
              </Link>
            </div>            
          </div>
          
          <ul>
            {tables.map(table => (
              <li key={table._id} className="bg-custom-light mb-4 p-4 rounded-lg shadow-sm">
                <div className='flex justify-between'>

                  <div className='text-white font-spartan font-thin text-lg mt-2'>
                    <p> <strong>Table Number:</strong>{` ${table.tableNum}`}</p>
                    <p> <strong>No of persons:</strong>{` ${table.quantity}`}</p>
                    <p> <strong className='mr-3'>Price:</strong>{`Rs. ${table.price}`}</p> 
                  </div>

                  <div className="mt-2">
                    <div>
                      <Link to={`/UpdateTablePage/${table._id}`}>
                          <button className="bg-blue-600 hover:bg-white hover:text-black text-white w-full py-3 px-3 rounded-lg mr-2 transition-all hover:scale-105 duration-300 ease-in-out">
                            Update <FontAwesomeIcon icon={faSync} />
                          </button>
                      </Link>
                    </div>
                    <div>
                      <button
                        className="bg-red-600 hover:bg-white mt-3 hover:text-black text-white w-full py-3 px-3 rounded-lg mr-2 transition-all hover:scale-105 duration-300 ease-in-out"
                        onClick={() => handleDelete(table._id)}
                      >
                        Delete <FontAwesomeIcon icon={faTrashCan} />
                      </button>                      
                    </div>
                  </div>
                </div>

              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Updatetable;
