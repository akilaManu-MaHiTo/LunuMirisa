import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import food from '../Images/Biriyani.jpg';

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
    axios.post("http://localhost:3001/Addtocart", {
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

  const handleDelete = (id) => {

    axios.delete('http://localhost:3001/deleteMenuList/'+id)
    .then(res => {console.log(res)

      window.location.reload()

    })
    .catch(err => console.log(err))
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-black  lg shadow-md w-full h-full max-w-4xl">
        <h2 className="text-white text-2xl font-bold mb-4">Menu Items</h2>
        {error && <p className="text-red-500">{error}</p>}
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {menuItems.map((item) => (
            <div key={item._id} className="bg-custom-dark p-6 rounded shadow-md">
              <div>
              <img src={food} alt="food" className='w-[14rem] h-auto rounded mx-auto mt-3' />
              </div>
    


    
    <div className="text-center text-white font-spartan font-thin text-3xl">{item.title}</div>
    <div className="text-center text-white font-spartan font-thin text-2xl mt-2">{item.category}</div>
    <div className="text-white font-spartan font-thin w-[19rem] text-2xl text-center h-auto rounded mx-auto mt-2">Rs.{item.price}/-</div>

    <Link to={`/UpdateMenuList/${item._id}`}>
    <button className='text-white bg-blue-600 p-2 rounded-md mr-2'>Update</button></Link>
    <button onClick={() => handleDelete(item._id)} className='text-white bg-red-500 p-2 rounded-md'>Delete</button> 

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
