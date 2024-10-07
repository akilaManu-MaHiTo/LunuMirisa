import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getCalculationByDay');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error:', errorText);
          throw new Error(`Server Error: ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        const labels = data.map(item => item.date);
        const totals = data.map(item => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Price',
              data: totals,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0)', // Set background to transparent
              borderWidth: 2,
              fill: false, // Set fill to false to remove the area fill
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message); // Set the error message
      }
    };

    fetchData();
  }, []);

  // Render error message if there's an error
  if (error) {
    return <div className="text-red-500 font-semibold text-center mt-4">{error}</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg h-[31.5rem]">
      {/* <h1 className="text-2xl font-bold text-white text-center mb-6">
        Total Price by Day
      </h1> */}
      <div className="relative w-full h-[400px]">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                  color: '#FFFFFF',
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                },
                ticks: {
                  color: '#FFFFFF',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Total Price',
                  color: '#FFFFFF',
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                },
                ticks: {
                  color: '#FFFFFF',
                },
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#FFFFFF',
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `Total: $${context.raw}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
