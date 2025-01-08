import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CalculateTotals = () => {
  const [calculateAllTotal, setCalculateAllTotal] = useState(0);
  const [calculateAll, setCalculateAll] = useState(0);
  const [calculateByNo, setCalculateByNo] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    // Fetch calculateAllTotal
    axios.get('https://lunu-mirisa.vercel.app/calculateAllTotal')
      .then(response => {
        setCalculateAllTotal(response.data.totalPrice); // Assuming your API returns { total: ... }
        console.log(response.data.totalPrice)
      })
      .catch(error => console.error('Error fetching calculateAllTotal:', error));

    // Fetch calculateAll
    axios.get('https://lunu-mirisa.vercel.app/CalculateAll')
      .then(response => {
        setCalculateAll(response.data.totalPrice); // Assuming your API returns { total: ... }
        console.log(response.data.totalPrice)
      })
      .catch(error => console.error('Error fetching CalculateAll:', error));

    // Fetch calculateByNo
    axios.get('https://lunu-mirisa.vercel.app/calculateByNo')
      .then(response => {
        setCalculateByNo(response.data.totalPrice); // Assuming your API returns { total: ... }
      })
      .catch(error => console.error('Error fetching calculateByNo:', error));
  }, []);

  useEffect(() => {
    // Calculate subtotal when any of the values change
    const total = calculateAll + calculateAllTotal - calculateByNo;
    setSubTotal(total);
  }, [calculateAll, calculateAllTotal, calculateByNo]);

  return (
    <div>
        <p className='text-white'>In Order restuarent total Price:{calculateAll}</p>
        <p className='text-white'>Online Order total Price:{calculateAllTotal}</p>
        <p className='text-white'>Inventory Supplier Order total Price:{calculateByNo}</p>
        <h2 className='text-white'>Subtotal: {subTotal}</h2>
    </div>
  );
};

export default CalculateTotals;
