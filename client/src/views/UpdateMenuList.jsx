import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';

const AddMenuList = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Correct use of useParams()

  // Fetch data when there's an ID (for editing an existing item)
  useEffect(() => {
    if (id) {
      axios.get(`https://lunu-mirisa.vercel.app/showMenu/${id}`)
        .then(result => {
          const { title, price, image, type, category, description } = result.data;
          setTitle(title);
          setPrice(price);
          setImage(image);
          setType(type);
          setCategory(category);
          setDescription(description)
        })
        .catch(err => console.log(err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const menuItem = { title, price, image, type, category,description };

    // If there's an ID, update the menu item; otherwise, create a new one
    if (id) {
      axios.put(`https://lunu-mirisa.vercel.app/updateMenu/${id}`, menuItem)
        .then(result => {
          console.log(result);
          navigate('/ManagerMenuList');
        })
        .catch(err => console.log(err));
    } else {
      axios.post("https://lunu-mirisa.vercel.app/createAddMenuList", menuItem)
        .then(result => {
          console.log(result);
          navigate('/ManagerMenuList');
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div>
      <AdminNaviBar selectedPage="Update Menu Item" />
      <Sidebar />   
      <div className="flex items-center justify-center min-h-screen bg-black"
                style={{ 
                  backgroundImage: `url(${bgAdmin})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
              }}
      >
        <div className="bg-custom-toolight mb-32 p-8 rounded-lg shadow-md mt-10 w-[35rem] ">
          <h2 className="text-2xl text-center font-light mb-4">{id ? "Edit Menu Item" : "Add Menu Item"}</h2>

          <div className='flex justify-center my-5'>
            <img 
                src={`https://lunu-mirisa.vercel.app/Images/` + image} 
                alt={image} 
                className="w-32 h-32 object-cover rounded-md"
              />
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            {/* <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div> */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                type="text"
                id="description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                placeholder="Enter category"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-5 bg-black text-white py-2 px-4 rounded-md hover:bg-white hover:text-black border border-black transition-all duration-300 ease-out transform hover:scale-105 "
            >
              {id ? "Update Menu Item" : "Add Menu Item"}
            </button>
            <Link to="/ManagerMenuList">
              <button className="mt-4 w-full bg-custom-light text-white py-2 px-4 rounded-md hover:bg-white hover:text-black border border-black transition-all duration-300 ease-out transform hover:scale-105  ">
                Menu List
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMenuList;
