import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ShowWaitorOrders = () => {
  const { userId } = useParams();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/ShowMyOrders/${userId}`)
      .then(response => {
        const uniqueDates = Array.from(new Set(response.data.map(date => new Date(date).toISOString().split('T')[0])));
        setDates(uniqueDates);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching order dates");
        setLoading(false);
      });
  }, [userId]);

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setLoading(true);
    axios.get(`http://localhost:3001/orders/${userId}/${date}`)
      .then(response => {
        // Remove duplicate orders based on orderId
        const uniqueOrders = Array.from(new Map(response.data.map(order => [order.orderId, order])).values());
        setOrders(uniqueOrders);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching orders");
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-600 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Waiter Orders</h1>

      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!loading && !error && (
        <>
          <select
            value={selectedDate}
            onChange={handleDateChange}
            className="mb-4 p-2 border border-gray-300 rounded"
          >
            <option value="">Select a date</option>
            {dates.length > 0 ? (
              dates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))
            ) : (
              <option disabled>No dates available</option>
            )}
          </select>

          {selectedDate && (
            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
              <h2 className="text-lg font-bold mb-2 text-white">
                Orders for {new Date(selectedDate).toLocaleDateString()}:
              </h2>
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.orderId} className="bg-white p-4 rounded shadow-md border border-gray-200">
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Table Number:</strong> {order.tableNum}</p>
                    <p><strong>Status:</strong> {order.ongoing}</p>
                    <Link to={`/OrderDetails/${order.orderId}`}>
                      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Show
                      </button>
                    </Link>
                    {/* Add more fields as needed */}
                  </div>
                ))
              ) : (
                <p>No orders found for this date.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShowWaitorOrders;
