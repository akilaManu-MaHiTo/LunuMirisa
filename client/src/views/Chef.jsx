import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartInfoDisplay = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getCartInfo');
        setCartItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartInfo();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteOrder/${itemId}`);
      setCartItems(cartItems.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Failed to delete the order.');
    }
  };

  const handlePrint = (item) => {
    const billContent = `
      <div>
        <h1>Bill for Order: ${item._id}</h1>
        <p><strong>Name:</strong> ${item.name}</p>
        <p><strong>Address:</strong> ${item.address}</p>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Payment Method:</strong> ${item.paymentMethod}</p>
        <p><strong>Submitted At:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
      </div>
    `;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print Bill</title></head><body>');
    printWindow.document.write(billContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <p>Loading cart information...</p>;
  }

  if (error) {
    return <p>Error fetching cart information: {error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-4">Cart Information</h2>
        <ul>
          {cartItems.map((item) => (
            <li key={item._id} className="mb-3 p-4 border text-2xl border-gray-300 rounded">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Address:</strong> {item.address}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Payment Method:</strong> {item.paymentMethod}</p>
              <p><strong>Submitted At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
              <div className="flex space-x-2">
                <button
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
                <button
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handlePrint(item)}
                >
                  Print Bill
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CartInfoDisplay;
