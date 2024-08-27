import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

function CreateSupplier(){
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const navigate = useNavigate();
  
   const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/AddSupplierOrder", {amount,price,deliveryDate,specialNote})
    .then(result => {
      console.log(result)
      navigate('/ShowSupplierOrder')
      
    })
    .catch(err => console.log(err))

   }


     return (
      
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
          <Link 
          to="/ShowSupplierOrder" 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
         My Orders
        </Link>


          <h2 className="text-2xl font-bold mb-6 text-center">Ingredient Order Form</h2>


          
          <form onSubmit={Submit} >
    
            <div className="mb-4">
              <label className="block text-gray-700">Amount (KG):</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-gray-700">Price (Rs):</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-gray-700">Date of Delivery:</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
                onChange={(e) =>setDeliveryDate(e.target.value)}
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-gray-700">Special Note (optional):</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded mt-1"
                onChange={(e) =>setSpecialNote (e.target.value)}
                
               
              />
            </div>
    
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
            >
              Submit Order
            </button>
    
          </form>
        </div>
      );

}
export default CreateSupplier;