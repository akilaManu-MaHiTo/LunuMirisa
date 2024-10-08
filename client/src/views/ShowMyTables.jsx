import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../Images/Logo.png';
import Loader from './Components/Loader.jsx'; 
import NavigationBar from './Components/NavigationBar.jsx'; 
import Footer from './Footer.jsx';
import bgtable from '../Images/table.jpg';

const TableReservation = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState([]); // State for payment details

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch table reservations
        const reservationResponse = await axios.get(`http://localhost:3001/getReservationByUserId/${userId}`);
        setTables(reservationResponse.data); // Assuming data is an array of tables
        setFilteredTables(reservationResponse.data); // Initialize with all tables

        // Fetch payment details
        const paymentResponse = await axios.get(`http://localhost:3001/paymentGetByUserId/${userId}`);
        setPaymentDetails(paymentResponse.data); // Assuming data is an array of payment details

        console.log("Payment Details:", paymentResponse.data); // Log the payment details

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <NavigationBar logo={logo} />
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ 
          backgroundImage: `url(${bgtable})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="bg-black bg-opacity-60 p-10 mt-16 rounded-xl shadow-lg w-[55rem] h-auto mb-40 border border-gray-500">
          <h1 className="font-spartan font-thin text-4xl mb-16 text-center text-white">Your Reserved Tables</h1>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center">
            {filteredTables.length === 0 ? (
              <p className="text-center text-white">No tables available for the selected quantity.</p>
            ) : (
              filteredTables.map(table => (
                <li key={table._id} className="p-6">
                  <div className="font-spartan duration-300 group cursor-pointer relative overflow-hidden bg-custom-dark w-56 h-72 rounded-3xl p-4 hover:w-56 hover:bg-gray-300">
                    <h3 className="text-3xl font-thin text-center text-white group-hover:text-black group-hover:text-2xl transition-all duration-300 ease-in-out">
                      Table
                    </h3>
                    <div className="gap-4 relative">
                      <h4 className="mt-10 duration-300 absolute left-1/2 -translate-x-1/2 text-[6rem] text-center group-hover:translate-x-9 group-hover:-translate-y-[4.45rem] group-hover:text-2xl text-white group-hover:text-black">
                        {`${table.tableNum}`}
                      </h4>
                    </div>
                    <div className="absolute duration-300 -left-40 mt-2 group-hover:left-10">
                      <p className="text-lg mt-5">{`Quantity: ${table.quantity}`}</p>
                      <p className="text-xl">{`Price: ${table.price}`}</p>
                      <p className="text-xl">{`Time: ${table.time}`}</p>
                      <p className="text-xl">{`Date: ${table.date}`}</p>
                      <div className="flex justify-center">
                        <Link to={`/UpdateReservedTables/${table._id}/${userId}`}>
                          <button className="bg-custom-dark text-white py-2 px-4 mt-6 w-24 hover:bg-black transition duration-300 ease-in-out">
                            Renew 
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      
      {/* Payment Details Section */}
      <div className="bg-black bg-opacity-60 p-10 mt-16 rounded-xl shadow-lg w-[55rem] mx-auto mb-20 border border-gray-500">
        <h2 className="font-spartan font-thin text-3xl mb-8 text-center text-white">Payment Details</h2>
        {paymentDetails.length > 0 ? (
          paymentDetails.map(payment => (
            <div key={payment._id} className="text-white mb-4">
              <p>{`Name: ${payment.name}`}</p>
              <p>{`Email: ${payment.email}`}</p>
              <p>{`Address: ${payment.address}`}</p>
              <p>{`Payment Method: ${payment.paymentMethod}`}</p>
              <p>{`Total Price: ${payment.totalPrice}`}</p>
              <p>{`Created At: ${new Date(payment.createdAt).toLocaleString()}`}</p>
              <h4 className="font-bold">Cart Items:</h4>
              {payment.cartItems.map(item => (
                <div key={item._id} className="ml-4">
                  <p>{`Title: ${item.title}`}</p>
                  <p>{`Quantity: ${item.quantity}`}</p> {/* Adjusting for the format */}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-white">No payment details found.</p>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TableReservation;
