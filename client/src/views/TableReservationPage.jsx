import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const TableReservation = () => {
  const { userId } = useParams();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);  // New state for loading
  console.log(`user id: ${userId}`);

  useEffect(() => {
    axios.get('http://localhost:3001/ShowTable')
      .then(result => {
        setTables(result.data);
        setLoading(false);  // Set loading to false after data is fetched
      })
      .catch(err => {
        console.log(err);
        setLoading(false);  // Set loading to false in case of an error
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/DeleteTable/${id}`)
      .then(() => {
        setTables(tables.filter(table => table._id !== id));
        console.log(`Deleted table with id: ${id}`);
      })
      .catch(err => console.log(err));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Table List</h1>
        <ul>
          {tables.map(table => (
            <li key={table._id} className="mb-4 p-4 border rounded shadow-sm">
              <div>
                <p>{`ID: ${table._id}`}</p>
                <p>{`Table Number: ${table.tableNum}`}</p>
                <p>{`Quantity: ${table.quantity}`}</p>
                <p>{`Price: ${table.price}`}</p>
              </div>
              <div className="mt-2">
                <Link to={`/ReservedTables/${table._id}/${userId}`}>
                  <button className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600">
                    Reserve
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableReservation;
