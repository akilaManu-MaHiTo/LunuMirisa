import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShowInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get("http://localhost:3001/ShowInventory")
      .then(response => {
        setInventory(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the inventory items!", error);
        setError('There was an error fetching the inventory items!');
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Link to="/Inventory"><button>Add Items</button></Link>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Inventory List</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          inventory.length === 0 ? (
            <p>No inventory items found.</p>
          ) : (
            <ul>
              {inventory.map((item) => (
                <li key={item._id} className="mb-4 p-4 border rounded">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover" />
                  <p>Quantity: {item.quantity}</p>
                  <p>Max Quantity: {item.maxQuantity}</p>
                  {item.quantity < 5 && (
                    <p className="text-red-500">Low inventory item</p>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default ShowInventory;
