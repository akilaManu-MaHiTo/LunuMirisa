import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import EmployeeNavigation from './Components/EmployeeNavigation';
import logo from '../Images/Logo.png';
import bgWaitor from '../Images/waitor-bg.jpg';


const ShowWaitorOrders = () => {
  const { userId } = useParams();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/ShowMyOrders/${userId}`)
      .then((response) => {
        const uniqueDates = Array.from(
          new Set(response.data.map((date) => new Date(date).toISOString().split('T')[0]))
        );
        setDates(uniqueDates);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching order dates');
        setLoading(false);
      });
  }, [userId]);

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setLoading(true);
    axios
      .get(`http://localhost:3001/orders/${userId}/${date}`)
      .then((response) => {
        // Remove duplicate orders based on orderId
        const uniqueOrders = Array.from(
          new Map(response.data.map((order) => [order.orderId, order])).values()
        );
        setOrders(uniqueOrders);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching orders');
        setLoading(false);
      });
  };

  return (
    <div>
      <EmployeeNavigation logo={logo} selectedPage="Menu"  />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-2"
                style={{ 
                  backgroundImage: `url(${bgWaitor})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                }}
      >
        <div className="max-w-3xl w-full">
          <div className='bg-custom-toolight rounded-lg p-10 mb-20 mt-20'>

          
            <h1 className="text-4xl font-thin mb-6 text-black"> <strong>Waiter Orders</strong></h1>
            <p className="text-lg mb-8 text-black">Select a date to view the orders placed on that day.</p>

            {loading && <div className=" flex text-black">
              <div
                class="w-10 h-10 border-4 border-t-custom-maroon border-gray-300 rounded-full animate-spin justify-center"
              ></div>

            </div>}
            {error && <div className="text-red-500 mb-6">{error}</div>}

            {!loading && !error && (
              <>
                <div className="flex justify-center mb-6">
                  <select
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full max-w-xs p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none  text-gray-100"
                  >
                    <option value="" disabled>
                      Select a date
                    </option>
                    {dates.length > 0 ? (
                      dates.map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString()}
                        </option>
                      ))
                    ) : (
                      <option disabled>No dates available</option>
                    )}
                  </select>
                </div>

                {selectedDate && (
                  <div className="w-full">
                    <h2 className="text-2xl font-thin mb-4 text-black">
                      Orders for {new Date(selectedDate).toLocaleDateString()}:
                    </h2>

                    {orders.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                        {orders.map((order) => (
                          <div
                            key={order.orderId}
                            className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 transform hover:scale-105 transition-transform duration-300"
                          >
                            <p className="text-lg font-semibold mb-2 text-gray-100">
                              <strong>Order ID:</strong> {order.orderId}
                            </p>
                            <p className="text-sm text-gray-400">
                              <strong>Table Number:</strong> {order.tableNum}
                            </p>
                            <p className="text-sm text-gray-400">
                              <strong>Status:</strong> {order.ongoing}
                            </p>
                            <Link to={`/OrderDetails/${order.orderId}`}>
                              <button className="mt-4 w-full py-2 bg-white hover:bg-black hover:border hover:border-black hover:text-white text-black rounded-lg font-medium transition duration-200">
                                Show Details
                              </button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg text-gray-400">No orders found for this date.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>    
  );
};

export default ShowWaitorOrders;
