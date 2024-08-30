import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png';
import Loader from './Components/Loader.jsx'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Footer from './Footer.jsx';
import bgtable from '../Images/table.jpg';

const TableReservation = () => {
  const { userId } = useParams();
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantities, setSelectedQuantities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/ShowTable')
      .then(result => {
        setTables(result.data);
        setFilteredTables(result.data); // Initialize with all tables
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
        const updatedTables = tables.filter(table => table._id !== id);
        setTables(updatedTables);
        setFilteredTables(updatedTables);
        console.log(`Deleted table with ID: ${id}`);
      })
      .catch(err => console.error(err));
  };

  const handleCheckboxChange = (quantity) => {
    const numericQuantity = Number(quantity); // Convert the value to a number
    let newSelectedQuantities;

    if (selectedQuantities.includes(numericQuantity)) {
      newSelectedQuantities = selectedQuantities.filter(q => q !== numericQuantity);
    } else {
      newSelectedQuantities = [...selectedQuantities, numericQuantity];
    }
    setSelectedQuantities(newSelectedQuantities);

    // Debugging: Check the selected quantities and filtered tables
    console.log(`Selected Quantities: ${newSelectedQuantities}`);

    if (newSelectedQuantities.length > 0) {
      const filtered = tables.filter(table => newSelectedQuantities.includes(Number(table.quantity)));
      setFilteredTables(filtered);
    } else {
      setFilteredTables(tables);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <NavigationBar logo={logo} />
      <div 
         className="flex items-center justify-center min-h-screen"
        style={{ 
          backgroundImage: `url(${bgtable})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="bg-black bg-opacity-60 p-10 mt-16 rounded-xl shadow-lg w-[55rem] h-auto mb-40 border border-gray-500">
          <h1 className="font-spartan font-thin text-3xl mb-6 text-center text-white">Reserve your table</h1>

          <div className="flex justify-center mb-6">
            <label className="text-white mr-4">
              <input 
                type="checkbox" 
                value={2} 
                onChange={() => handleCheckboxChange(2)} 
                checked={selectedQuantities.includes(2)}
                className="mr-2"
              />
              Quantity 2
            </label>
            <label className="text-white mr-4">
              <input 
                type="checkbox" 
                value={4} 
                onChange={() => handleCheckboxChange(4)} 
                checked={selectedQuantities.includes(4)}
                className="mr-2"
              />
              Quantity 4
            </label>
            <label className="text-white">
              <input 
                type="checkbox" 
                value={6} 
                onChange={() => handleCheckboxChange(6)} 
                checked={selectedQuantities.includes(6)}
                className="mr-2"
              />
              Quantity 6
            </label>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center">
            {filteredTables.length === 0 ? (
              <p className="text-center text-white">No tables available for the selected quantity.</p>
            ) : (
              filteredTables.map(table => (
                <li 
                  key={table._id} 
                  className="p-6"
                >
                  <div
                    className="font-spartan duration-300 group cursor-pointer relative overflow-hidden bg-custom-dark w-56 h-64 rounded-3xl p-4 hover:w-56 hover:bg-gray-300"
                  >
                    <h3 className="text-3xl font-thin text-center text-white group-hover:text-black group-hover:text-2xl transition-all duration-300 ease-in-out">
                      Table
                    </h3>
                    <div className="gap-4 relative">
                      <h4
                        className="
                          mt-10 duration-300 absolute left-1/2 -translate-x-1/2 text-[6rem] text-center 
                          group-hover:translate-x-9 group-hover:-translate-y-[4.45rem] 
                          group-hover:text-2xl text-white group-hover:text-black"
                      >
                        {`${table.tableNum}`}
                      </h4>
                    </div>
                    <div className="absolute duration-300 -left-32 mt-2 group-hover:left-10">
                      <p className="text-12 mt-3">{`Quantity: ${table.quantity}`}</p>
                      <p className="text-12">{`Price: ${table.price}`}</p>
                      <div className="flex justify-center">
                        <Link to={`/ReservedTables/${table._id}/${userId}`}>
                          <button className="bg-custom-dark text-white py-2 px-4 hover:bg-black transition duration-300 ease-in-out">
                            Reserve
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TableReservation;
