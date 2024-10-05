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
      setCartItems(cartItems.filter((item) => item._id !== itemId));
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
        <h2>Items:</h2>
        <ul>
          ${item.cartItems
            .map(
              (cartItem) =>
                `<li>${cartItem.title} - Quantity: ${cartItem.quantity}</li>`
            )
            .join('')}
        </ul>
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
    return <p className="text-white text-center">Loading cart information...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error fetching cart information: {error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Cart Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
              <p className="text-white mb-2"><strong>Name:</strong> {item.name}</p>
              <p className="text-white mb-2"><strong>Address:</strong> {item.address}</p>
              <p className="text-white mb-2"><strong>Email:</strong> {item.email}</p>
              <p className="text-white mb-2"><strong>Payment Method:</strong> {item.paymentMethod}</p>
              <p className="text-white mb-4"><strong>Submitted At:</strong> {new Date(item.createdAt).toLocaleString()}</p>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Cart Items:</h3>
                <ul className="list-disc pl-5 text-white">
                  {item.cartItems.map((cartItem) => (
                    <li key={cartItem._id}>
                      {cartItem.title} - Quantity: {cartItem.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  onClick={() => handlePrint(item)}
                >
                  Print Bill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartInfoDisplay;
