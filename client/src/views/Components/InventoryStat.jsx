import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraph = () => {
  const [itemLabels, setItemLabels] = useState([]);
  const [itemQuantities, setItemQuantities] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ShowInventory'); // Replace with your actual endpoint
        const data = response.data;

        // Set the labels (item names) and data (quantities)
        const items = data.map(item => item.name);
        const quantities = data.map(item => item.quantity);

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
    labels: itemLabels, // Items on the x-axis
    datasets: [
      {
        label: 'Quantity',
        data: itemQuantities, // Quantities on the y-axis
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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
    scales: {
      x: {
        ticks: {
          color: '#ffffff', // White labels for the x-axis
        },
        title: {
          display: true,
          text: 'Items',
          color: '#ffffff', // White x-axis title
        },
      },
      y: {
        ticks: {
          color: '#ffffff', // White labels for the y-axis
        },
        title: {
          display: true,
          text: 'Quantities',
          color: '#ffffff', // White y-axis title
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Inventory Bar Graph</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarGraph;
