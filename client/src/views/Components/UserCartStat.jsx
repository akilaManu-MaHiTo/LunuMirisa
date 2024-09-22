import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = () => {
  const [userLabels, setUserLabels] = useState([]);
  const [itemData, setItemData] = useState([]);

  // Shuffle array function
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/itemCounts'); // Replace with your actual endpoint
        const data = response.data;

        // Shuffle the data to randomize user selection
        const shuffledData = shuffleArray(data);

        // Select two random users and their item counts
        const selectedData = shuffledData.slice(0, 2);
        const users = selectedData.map(item => item.userId);
        const items = selectedData.map(item => item.items);

        setUserLabels(users);
        setItemData(items);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: userLabels, // Randomly selected users on the x-axis
    datasets: [
      {
        label: 'Items Count',
        data: itemData, // Corresponding item counts on the y-axis
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#ffffff', // White text for legend in dark mode
        },
      },
      title: {
        display: true,
        text: 'Random Two Users vs Items',
        color: '#ffffff', // White text for the title
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff', // White text for x-axis labels
        },
        title: {
          display: true,
          text: 'Users',
          color: '#ffffff', // White text for x-axis title
        },
      },
      y: {
        ticks: {
          color: '#ffffff', // White text for y-axis labels
        },
        title: {
          display: true,
          text: 'Item Count',
          color: '#ffffff', // White text for y-axis title
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Random Two Users vs Items</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineGraph;
