import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/ShowMenuList")
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the menu items!", error);
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-custom-gray p-6 rounded shadow-md">
                <img src={item.image} alt={item.title} className='w-full h-auto rounded' />
                <div className="text-center text-black font-spartan font-thin m-4">{item.title}</div>
                <div className="text-center text-black font-spartan font-thin">Rs.{item.price}/-</div>
                <div className="text-center text-black font-spartan font-thin">{item.type}</div>
                <div className="text-center text-black font-spartan font-thin">{item.category}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default ShowMenuList;
