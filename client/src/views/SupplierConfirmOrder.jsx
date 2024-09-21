import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SupplierConfirmOrder() {
  const { supplierId, orderId, supplierName } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [amount, setAmount] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/order/${orderId}`)
      .then(res => {
        setOrderData(res.data);
      })
      .catch(err => console.error('Error fetching order details:', err));
  }, [orderId]);

  const handleConfirm = (e) => {
    e.preventDefault();

    const orderQuantity = orderData.maxQuantity - orderData.quantity;

    if (amount > orderQuantity) {
      setErrorMessage(`Amount cannot exceed Order Quantity (${orderQuantity})`);
      return;
    }

    setErrorMessage('');

    const confirmationData = {
      name: orderData.name,
      orderQuantity: orderData.maxQuantity - orderData.quantity,
      category: orderData.category,
      amount,
      deliveryDate,
      specialNote,
      supplierId, 
      supplierName,
    };

    axios.post('http://localhost:3001/AddSupplierOrder', confirmationData)
      .then(response => {
        setSuccessMessage('Order confirmed successfully!');
        setErrorMessage('');
        setAmount('');
        setDeliveryDate('');
        setSpecialNote('');

        setTimeout(() => {
          navigate(`/SupplierDashboard/${supplierId}`);
        }, 3000);
      })
      .catch(err => {
        console.error('Error confirming order:', err);
        setErrorMessage('Error confirming order. Please try again.');
        setSuccessMessage('');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Order Confirmation</h1>
      {orderData ? (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Order Details</h2>
          <p><strong>Name:</strong> {orderData.name}</p> 
          <p><strong>Order Quantity:</strong> {orderData.maxQuantity - orderData.quantity}</p>
          <p><strong>Category:</strong> {orderData.category}</p>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          <form onSubmit={handleConfirm} className="mt-8">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border rounded w-full py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="border rounded w-full py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Special Note (Optional)</label>
              <textarea
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                className="border rounded w-full py-2 px-3"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded hover:bg-blue-600 transition duration-200"
            >
              Confirm
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading order details...</p>
      )}
    </div>
  );
}

export default SupplierConfirmOrder;
