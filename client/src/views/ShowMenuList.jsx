import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ShowMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    axios.get("http://localhost:3001/ShowMenuList")
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the menu items!", error);
        setError('There was an error fetching the menu items!');
      });
  }, []);

  const handleAddToCart = (item) => {
    console.log("Adding to cart:", userId, item._id, item.category, item.type, item.price);
    axios.post("http://localhost:3001/Addtocarts", {
      userId,
      itemId: item._id,
      category: item.category,
      type: item.type,
      price: item.price
    })
    .then(response => {
      console.log("Added to cart:", response.data);
    })
    .catch(error => {
      console.error("There was an error adding the item to the cart!", error);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-black p-8 lg shadow-md w-full h-full max-w-4xl">
        <h2 className="text-white text-2xl font-bold mb-4">Menu Items</h2>
        {error && <p className="text-red-500">{error}</p>}
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-custom-black p-6 rounded shadow-md">
                <div className="bg-custom-gray h-[34rem] p-6 rounded shadow-md w-[22rem] max-w-md mb-4 md:mb-0 flex flex-col items-center">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddToCart(item);
                    }}
                  >
                    <input type='text' value={userId} readOnly /><br />
                    <label>Menu list Id</label><br />
                    <input type='text' value={item._id} readOnly /><br />
                    <label>Category</label><br />
                    <input type='text' value={item.category} readOnly /><br />
                    <label>Food name</label><br />
                    <input type='text' value={item.type} readOnly /><br />
                    <label>Price</label><br />
                    <input type='text' value={item.price} readOnly /><br />
                    <button type='submit'>Add to cart</button>
                  </form>
                </div>
                <div className="text-white font-spartan font-thin w-[19rem] h-auto rounded mx-auto mt-2">Rs.{item.price}/-</div>
                <div className="text-center text-white font-spartan font-thin mt-8 text-3xl">{item.type}</div>
                <div className="text-center text-white font-spartan font-thin text-2xl mt-2">{item.category}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white-700">No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default ShowMenuList;
