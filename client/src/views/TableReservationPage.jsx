import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png';
import Loader from './Components/Loader.jsx'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Footer from './Footer.jsx';

const TableReservation = () => {
  const { userId } = useParams();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(`User ID: ${userId}`);

  useEffect(() => {
    axios.get('http://localhost:3001/ShowTable')
      .then(result => {
        setTables(result.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/DeleteTable/${id}`)
      .then(() => {
        setTables(tables.filter(table => table._id !== id));
        console.log(`Deleted table with ID: ${id}`);
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <NavigationBar logo={logo} />
      <div className="bg-custom-dark flex items-center justify-center min-h-screen">
        <div className=" bg-custom-light p-10 mt-16 rounded-xl shadow-lg w-[50rem] mb-40 ">
          <h1 className=" font-spartan font-thin text-3xl mb-6 text-center text-white">Reserve your table</h1>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  justify-center ">
          {tables.map(table => (
            <li 
            key={table._id} 
            className=" p-6 "
            >
            
          <div
              class=" font-spartan duration-300  group cursor-pointer relative overflow-hidden bg-custom-dark w-28 h-48 rounded-3xl p-4 hover:w-56 hover:bg-gray-300"
            >
              <h3 class="text-2xl text-center text-white group-hover:text-black group-hover:text-center : ">Table</h3>
              <div class="gap-4 relative">
              
              <h4
                className="
                  mt-10 duration-300 absolute left-1/2 -translate-x-1/2 text-5xl text-center 
                  group-hover:translate-x-9 group-hover:-translate-y-[4.45rem] 
                  group-hover:text-2xl text-white group-hover:text-black "
              >
                {`${table.tableNum}`}
              </h4>

              </div>
              <div class="absolute duration-300 -left-32 mt-2 group-hover:left-10">
                <p class="text-sm mt-3">{`Quantity: ${table.quantity}`}</p>
                <p class="text-sm">{`Price: ${table.price}`}</p>

                <div className="flex justify-center">
                  <Link to={`/ReservedTables/${table._id}/${userId}`}>
                    <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                      Reserve
                    </button>
                  </Link>
                </div>

              </div>
            </div>
            </li>
            ))}
            </ul>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TableReservation;
