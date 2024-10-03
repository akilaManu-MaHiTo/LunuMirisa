import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ShowMangerMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState({}); // State to store selected percentages

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

  const handleDelete = (id) => {
    axios.delete('http://localhost:3001/deleteMenuList/' + id)
      .then(res => {
        console.log(res);
        setMenuItems(menuItems.filter(item => item._id !== id)); // Update state to remove the deleted item
      })
      .catch(err => console.log(err));
  };

  const handleHotDealsToggle = (itemId) => {
    const percentage = selectedPercentage[itemId] || 1; // Default percentage to 1 if not selected
    axios.put(`http://localhost:3001/UpdateHotDeals/${itemId}`, { percentage })
      .then(res => {
        // Update the state with the new hot deals status and percentage
        setMenuItems(menuItems.map(item =>
          item._id === itemId ? { ...item, hotDeals: res.data.hotDeals, percentage: res.data.percentage } : item
        ));
      })
      .catch(err => console.log(err));
  };

  const handlePercentageSelect = (itemId, percentage) => {
    setSelectedPercentage({
      ...selectedPercentage,
      [itemId]: percentage,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-black lg shadow-md w-full h-full max-w-4xl">
        <h2 className="text-white text-2xl font-bold mb-4">Menu Items</h2>
        {error && <p className="text-red-500">{error}</p>}
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-custom-dark p-6 rounded shadow-md">
                <img 
                  src={`http://localhost:3001/Images/${item.image}`} 
                  alt={item.title} 
                  className="w-full h-64 object-cover rounded shadow-md"
                />
                <div className="text-center text-white font-spartan font-thin text-3xl">{item.title}</div>
                <div className="text-center text-white font-spartan font-thin text-2xl mt-2">{item.category}</div>
                <div className="text-white font-spartan font-thin w-[19rem] text-2xl text-center h-auto rounded mx-auto mt-2">Rs.{item.price}/-</div>
                <Link to={`/UpdateMenuList/${item._id}`}>
                  <button className='text-white bg-blue-600 p-2 rounded-md mr-2'>Update</button>
                </Link>
                <button onClick={() => handleDelete(item._id)} className='text-white bg-red-500 p-2 rounded-md'>Delete</button>
                
                {/* Hot Deals Section */}
                <div className="mt-4">
                  <label className="text-white mr-2">Hot Deal Percentage</label>
                  <select 
                    value={selectedPercentage[item._id] || item.percentage || 1} 
                    onChange={(e) => handlePercentageSelect(item._id, e.target.value)} 
                    className="bg-gray-700 text-white p-2 rounded-md mt-2"
                    disabled={item.hotDeals === "Yes"} // Enable when hotDeals is "No"
                  >
                    <option value="1">1%</option>
                    <option value="2">2%</option>
                    <option value="3">3%</option>
                    <option value="4">4%</option>
                    <option value="5">5%</option>
                  </select>
                </div>

                <button onClick={() => handleHotDealsToggle(item._id)} className='text-white bg-green-600 p-2 rounded-md mt-2'>
                  {item.hotDeals === "Yes" ? "Remove Hot Deal" : "Add to Hot Deals"}
                </button>
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

export default ShowMangerMenuList;
