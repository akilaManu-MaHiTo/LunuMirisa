import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Inventory = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null); 
  const [quantity, setQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [category, setCategory] = useState('Vegetables');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('quantity', quantity);
    formData.append('maxQuantity', maxQuantity);
    formData.append('category', category);
  
    axios.post("http://localhost:3001/AddInventory", formData)
      .then(result => {
        console.log(result);
        navigate('/ShowInventory'); // Navigate to the inventory list if successful
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          alert('Item with the same name already exists. Please choose a different name.'); // Alert for duplicate name
        } else {
          console.log(err); // Log other errors
        }
      });
  };
  

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <AdminNaviBar selectedPage="Add Inventory Items" />
      <Sidebar /> 
      <div className="flex items-center justify-center min-h-screen bg-black">
        <form 
          onSubmit={handleSubmit} 
          className="bg-custom-toolight p-6 rounded shadow-md w-[35rem] "
        >
          <h2 className="text-2xl font-bold mb-4">Add Inventory Item</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>


          <div className="mb-4">
            <div class="grid w-full max-w-xs items-center gap-1.5">
                  <label class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Picture</label>
                  <input  
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleImageChange}  class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"/>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxQuantity">
              Max Quantity
            </label>
            <input
              type="number"
              name="maxQuantity"
              id="maxQuantity"
              value={maxQuantity}
              onChange={(e) => setMaxQuantity(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Spices">Spices</option>
              <option value="Meat">Meat</option>
              <option value="Fisheries">Fisheries</option>
            </select>
          </div>
          <div className='flex justify-center'>
            <button
              type="submit"
              className="bg-black hover:bg-white hover:text-black text-white  font-light mt-5 py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-out transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faPlus} /> Add Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Inventory;
