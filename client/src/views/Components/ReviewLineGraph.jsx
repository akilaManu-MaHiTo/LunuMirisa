// src/ReviewChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReviewChart = () => {
  const [reviewCounts, setReviewCounts] = useState([]);

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ReviewCountByRating');
        setReviewCounts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching review counts:', error);
      }
    };
    fetchData();
  }, []);

  // Prepare data for Doughnut (Ring) Chart
  const labels = reviewCounts.map(item => `Rating ${item._id}`);
  const data = {
    labels: labels,
    datasets: [
      {
        label: '# of Reviews',
        data: reviewCounts.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for Doughnut chart, including larger cutout for center hole
  const options = {
    cutout: '80%', // Increase the cutout to make the center hole larger
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      
      <div className="w-full flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ReviewChart;
