import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [itemLabels, setItemLabels] = useState([]);
  const [itemQuantities, setItemQuantities] = useState([]);

  // Function to get random items
  const getRandomItems = (data, count) => {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://lunu-mirisa.vercel.app/ShowInventory'); // Replace with your actual endpoint
        const data = response.data;

        // Get random 5 items
        const randomItems = getRandomItems(data, 4);
        const items = randomItems.map(item => item.name);
        const quantities = randomItems.map(item => item.quantity);

        setItemLabels(items);
        setItemQuantities(quantities);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: itemLabels, // Item names for the pie chart
    datasets: [
      {
        label: 'Quantity',
        data: itemQuantities, // Quantities for each item
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', // Red
          'rgba(54, 162, 235, 0.2)', // Green
          'rgba(255, 206, 86, 0.2)', // Blue
          'rgba(75, 192, 192, 0.2)', // Yellow
          'rgba(153, 102, 255, 0.2)', // Orange
          // 'rgba(128, 0, 128, 0.2)', // Purple
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', // Red
          'rgba(54, 162, 235, 1)', // Green
          'rgba(255, 206, 86, 1)', // Blue
          'rgba(75, 192, 192, 1)', // Yellow
          'rgba(153, 102, 255, 1)', // Orange
          // 'rgba(128, 0, 128, 1)', // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: '80%', // Creates a ring chart
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#ffffff', // White text for the legend in dark mode
        },
      },
      title: {
        display: true,
        text: 'Inventory Items vs Quantities',
        color: '#ffffff', // White text for the title
      },
    },
  };

  return (
    <div className="bg-gray-900 text-white pl-48 pt-7 rounded-lg shadow-lg h-[31.5rem]"> {/* Adjusted height for smaller chart */}
      {/* <h2 className="text-2xl font-bold mb-4">Inventory Ring Chart</h2> */}
      <div style={{ height: '25rem' }}> {/* Set the height of the ring chart */}
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PieChart;
