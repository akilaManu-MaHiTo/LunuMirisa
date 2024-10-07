import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNaviBar from './Components/AdminNavigationBar';
import ToggleSlideBar from './Components/ToggleSlideBar';
import useSidebar from './Components/useSidebar';
import Loader from './Components/Loader';

const UpdateInventory = () => {
  const { id } = useParams(); // Get the ID from the URL params
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState(''); // Store the image URL
  const [quantity, setQuantity] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);
  const [reduceQuantity, setReduceQuantity] = useState(0); // New state for reduceQuantity
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [category, setCategory] = useState('Vegetables');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const calculatedTotal =0; // Correct calculation without parseInt
  const { isSidebarVisible, toggleSidebar, sidebarRef } = useSidebar();

  useEffect(() => {
    if (id) {
      // Fetch the inventory item by ID
      axios.get(`http://localhost:3001/GetInventory/${id}`)
        .then(response => {
          const item = response.data;
          setName(item.name);
          setQuantity(item.quantity);
          setMaxQuantity(item.maxQuantity);
          setCategory(item.category);
          setImageURL(`http://localhost:3001/Images/${item.image}`); // Set the image URL
          setLoading(false);
        })
        .catch(err => console.log(err));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if both newQuantity and reduceQuantity are 0
    if (newQuantity === 0 && reduceQuantity === 0) {
      alert('Please update the quantity or reduce it before submitting.');
      return; // Stop the form submission
    }
  
    const calculatedTotal = reduceQuantity === 0
      ? quantity + newQuantity
      : quantity - reduceQuantity;
  
    // Ensure calculatedTotal doesn't drop below 0 (additional safeguard)
    if (calculatedTotal < 0) {
      alert('Quantity cannot be less than 0.');
      return;
    }
  
    axios.put(`http://localhost:3001/updateInventory/${id}`, { newTotal: calculatedTotal })
      .then(response => {
        alert('Update Successfully');
        navigate('/ShowInventory');
      })
      .catch(err => console.log(err));
  };
  
  
  

  // Handle new quantity change
  const handleNewQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    setNewQuantity(value > 0 ? value : 0);

    if (value > 0) {
      setReduceQuantity(0); // Reset reduceQuantity when newQuantity is positive
    }
  };

  // Handle reduce quantity change
  const handleReduceQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    setReduceQuantity(value > 0 ? value : 0);

    if (value > 0) {
      setNewQuantity(0); // Reset newQuantity when reduceQuantity is positive
    }
  };

  if (loading) {
    return <Loader />;
  }

  // SidebarWithOverlay component
  const SidebarWithOverlay = () => (
    <div className="flex">
      <ToggleSlideBar ref={sidebarRef} isVisible={isSidebarVisible} />
      {isSidebarVisible && (
        <div
          className="fixed inset-0 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );

  // Generate dropdown options
  const generateOptions = () => {
    const options = [];
  
    if (quantity !== 0) {
      for (let i = 0; i <= quantity; i++) {
        options.push(
          <option key={i} value={i}>{i}</option>
        );
      }
    } else {
      for (let i = 0; i <= maxQuantity; i++) {
        options.push(
          <option key={i} value={i}>{i}</option>
        );
      }
    }
  
    return options;  // Always return options
  };
  

  // MainContent component
  const MainContent = () => (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form 
        onSubmit={handleSubmit} 
        className="bg-custom-toolight p-6 rounded shadow-md w-[35rem] my-10"
      >
        <h2 className="text-2xl font-thin text-center mb-4">{id ? "Edit" : "Add"} Place Order For Suppliers</h2>
        
        <div className="mb-4 flex items-center justify-center">
          {imageURL && (
            <img 
              src={imageURL} 
              alt={name} 
              className="w-32 h-32 object-cover rounded-md mb-2"
            />
          )}
          <input type="hidden" name="imageURL" value={imageURL} />
        </div>

        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="name">
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
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="quantity">
            Current Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2" htmlFor="newQuantity">
            New Quantity
          </label>
          <select
            name="newQuantity"
            id="newQuantity"
            value={newQuantity}
            onChange={handleNewQuantityChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={reduceQuantity > 0} // Disable if reduceQuantity has a value
            required={reduceQuantity === 0} // Make required only if reduceQuantity is 0
          >
            {generateOptions()}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-blacktext-sm font-bold mb-2" htmlFor="reduceQuantity">
            Reduce Quantity
          </label>
          <select
            name="reduceQuantity"
            id="reduceQuantity"
            value={reduceQuantity}
            onChange={handleReduceQuantityChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={newQuantity > 0} // Disable if newQuantity has a value
            required={newQuantity === 0} // Make required only if newQuantity is 0
          >
            {generateOptions()}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="maxQuantity">
            Max Quantity
          </label>
          <input
            type="number"
            name="maxQuantity"
            id="maxQuantity"
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <input
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            readOnly
          
          />
        </div>

        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="bg-black hover:bg-white hover:text-black text-white  font-light py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-out transform hover:scale-105"
          >
            Update Inventory
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <AdminNaviBar selectedPage="Edit Item" />
      <SidebarWithOverlay />
      <div className="container mx-auto p-4">
        <MainContent />
      </div>
    </div>
  );
};

export default UpdateInventory;
