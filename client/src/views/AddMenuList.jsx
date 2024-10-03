import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavigationBar from './Components/NavigationMenuListManager'; 
import logo from '../Images/Logo.png'; 

const AddMenuList = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null); // Updated to store file
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("image", image); // Added image file
        formData.append("category", category);

        axios.post("http://localhost:3001/createAddMenuList", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(result => {
            console.log(result);
            navigate('/ManagerMenuList');
        })
        .catch(err => console.log(err));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Set the selected file
    };

    return (
        <div>
            <NavigationBar logo={logo} /> 
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleImageChange} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" disabled>Select category</option>
                                <option value="Appetizers">Appetizers</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Specials">Specials</option>
                                <option value="Beverages">Beverages</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Add Menu Item
                        </button>

                        <Link to="/ManagerMenuList">
                            <button type="button" className="mt-4 w-full bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none">
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
