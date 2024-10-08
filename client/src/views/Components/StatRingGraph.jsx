import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const CalculateTotalsChart = () => {
  const [calculateAllTotal, setCalculateAllTotal] = useState(0);
  const [calculateAll, setCalculateAll] = useState(0);
  const [calculateByNo, setCalculateByNo] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    // Fetch calculateAllTotal
    axios.get('http://localhost:3001/calculateAllTotal')
      .then(response => {
        setCalculateAllTotal(response.data.totalPrice); // Assuming your API returns { totalPrice: ... }
      })
      .catch(error => console.error('Error fetching calculateAllTotal:', error));

    // Fetch calculateAll
    axios.get('http://localhost:3001/CalculateAll')
      .then(response => {
        setCalculateAll(response.data.totalPrice); // Assuming your API returns { totalPrice: ... }
      })
      .catch(error => console.error('Error fetching CalculateAll:', error));

    // Fetch calculateByNo
    axios.get('http://localhost:3001/calculateByNo')
      .then(response => {
        setCalculateByNo(response.data.totalPrice); // Assuming your API returns { totalPrice: ... }
      })
      .catch(error => console.error('Error fetching calculateByNo:', error));
  }, []);

  useEffect(() => {
    // Calculate subtotal when any of the values change
    const total = calculateAll + calculateAllTotal - calculateByNo;
    setSubTotal(total);
  }, [calculateAll, calculateAllTotal, calculateByNo]);

  // Prepare data for Horizontal Bar Chart
  const data = {
    labels: ['Online Order', 'In-Order Restaurant', 'Inventory Supplier'],
    datasets: [
      {
        label: 'Order Totals',
        data: [calculateAll, calculateAllTotal, calculateByNo],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y', // This makes it a horizontal bar chart
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Order Totals Distribution',
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      {/* <h2 className="text-2xl font-bold text-white mb-4">Order Totals Summary</h2> */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center text-white">
          <p className="text-lg font-semibold font-spartan">Subtotal</p>
          <p className="text-3xl font-bold font-spartan"><strong className='text-lg font-spartan'>Rs.</strong>{subTotal.toFixed(2)}</p>
        </div>
        <div className="w-full max-w-xl">
          <Bar data={data} options={options} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white mt-6 font-spartan">
        <div className="bg-gray-700 p-4 rounded-md shadow-md">
          <p className="text-lg font-semibold">Online Order Total Price</p>
          <p className="text-2xl font-bold"><strong className='text-lg font-spartan'>Rs.</strong>{calculateAll.toFixed(2)}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md shadow-md font-spartan">
          <p className="text-lg font-semibold">In-Order Restaurant Total Price</p>
          <p className="text-2xl font-bold"><strong className='text-lg font-spartan'>Rs.</strong>{calculateAllTotal.toFixed(2)}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md shadow-md font-spartan">
          <p className="text-lg font-semibold">Inventory Supplier Order Total Price</p>
          <p className="text-2xl font-bold"><strong className='text-lg font-spartan'>Rs.</strong>{calculateByNo.toFixed(2)}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md shadow-md font-spartan">
          <p className="text-lg font-semibold">Income Total</p>
          <p className="text-2xl font-bold">
            <strong className='text-lg font-spartan'>Rs.</strong>
            {(calculateAll + calculateAllTotal - calculateByNo).toFixed(2)}
          </p>

        </div>
      </div>
    </div>
  );
};

export default CalculateTotalsChart;
