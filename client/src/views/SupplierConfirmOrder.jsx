import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SupplierConfirmOrder() {
  const { supplierId, orderId, supplierName } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [quantity, setQuantity] = useState(''); // Use 'quantity' for the dropdown value
  const [unitPrice, setUnitPrice] = useState(''); // Now editable via input field
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    axios.get(`http://localhost:3001/order/${orderId}`)
      .then(res => {
        setOrderData(res.data);
        setUnitPrice(res.data.unitPrice || 0); // Initial unit price from the order
      })
      .catch(err => console.error('Error fetching order details:', err));
  }, [orderId]);

  const calculateTotalAmount = (qty, price) => {
    if (qty && price) {
      const calculatedTotal = Number(qty) * Number(price);
      setTotalAmount(calculatedTotal);
    } else {
      setTotalAmount(0);
    }
  };

  const handleQuantityChange = (e) => {
    const selectedQuantity = e.target.value;
    setQuantity(selectedQuantity);
    calculateTotalAmount(selectedQuantity, unitPrice); // Recalculate total based on quantity change
  };

  const handleUnitPriceChange = (e) => {
    const newUnitPrice = e.target.value;
    setUnitPrice(newUnitPrice);
    calculateTotalAmount(quantity, newUnitPrice); // Recalculate total based on unit price change
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const orderQuantity = quantity;

    if (quantity > orderQuantity) {
      setErrorMessage(`Quantity cannot exceed Order Quantity (${orderQuantity})`);
      return;
    }

    setErrorMessage('');

    const confirmationData = {
      name: orderData.name,
      orderQuantity:quantity,
      category: orderData.category,
      unitPrice,
      totalAmount,
      deliveryDate,
      specialNote,
      supplierId,
      supplierName,
    };

    axios.post('http://localhost:3001/AddSupplierOrder', confirmationData)
      .then(response => {
        setSuccessMessage('Order confirmed successfully!');
        setErrorMessage('');
        setQuantity('');
        setDeliveryDate('');
        setSpecialNote('');
        setTotalAmount(0);

        setTimeout(() => {
          navigate(`/SupplierDashboard/${supplierId}`);
        }, 3000);

        // Update order quantity after confirming
        const updateQuantity = orderData.orderQuantity - quantity;
        axios.put(`http://localhost:3001/UpdateOrderInventory/${orderId}`, { orderQuantity: updateQuantity })
          .then(() => console.log('Order quantity updated successfully'))
          .catch(err => console.error('Error updating order quantity:', err));
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
          <p><strong>Order Quantity:</strong> {orderData.orderQuantity}</p>
          <p><strong>Category:</strong> {orderData.category}</p>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          <form onSubmit={handleConfirm} className="mt-8">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded w-full py-2 px-3"
              required
            >
              <option value="">Select Quantity</option>
              {/* Generate options based on orderQuantity */}
              {[...Array(orderData.orderQuantity + 1).keys()].map(num => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Unit Price</label>
              <input
                type="number"
                value={unitPrice}
                onChange={handleUnitPriceChange}
                className="border rounded w-full py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Total Price</label>
              <input
                type="text"
                value={`$${totalAmount.toFixed(2)}`}
                readOnly
                className="border rounded w-full py-2 px-3 bg-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="border rounded w-full py-2 px-3"
                min={today} // Prevent selecting earlier dates
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
