import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const TotalPriceChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://lunu-mirisa.vercel.app/totalPriceByDay');
                const data = response.data;

                const labels = data.map(item => item.date);
                const prices = data.map(item => item.totalPrice);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Price',
                            data: prices,
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            borderColor: 'rgba(255, 0, 0, 1)',
                            borderWidth: 1
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Total Price by Day</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date',
                                    color: '#ffffff'
                                },
                                ticks: {
                                    color: '#ffffff'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Total Price',
                                    color: '#ffffff'
                                },
                                beginAtZero: true,
                                ticks: {
                                    color: '#ffffff'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#ffffff'
                                }
                            }
                        }
                    }}
                />
            )}
        </div>
    );
};

export default TotalPriceChart;
