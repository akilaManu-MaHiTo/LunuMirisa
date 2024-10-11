import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const TotalPriceCalculator = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPrices, setTotalPrices] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [employeeData, setEmployeeData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchTotalPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/calculateByDateAndTable`);
      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setOriginalData(response.data);
        const sortedData = response.data.sort((a, b) => b.totalAmount - a.totalAmount);
        setTotalPrices(sortedData);
        calculateTotalAmount(sortedData); // Calculate total for initial load
      } else {
        console.error("Unexpected response structure:", response.data);
        setTotalPrices([]);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to fetch data.');
      setTotalPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/employee/${id}`);
      setEmployeeData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching employee data');
      setEmployeeData(null);
    }
  };

  const filterDataByDate = (date) => {
    if (!date) {
      // If the date is cleared, display all data
      setTotalPrices(originalData);
      calculateTotalAmount(originalData);
      return;
    }

    const filteredData = originalData.filter(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === date;
    });
    
    console.log("Filtered Data:", filteredData);
    setTotalPrices(filteredData);
    calculateTotalAmount(filteredData);
  };

  const calculateTotalAmount = (data) => {
    const total = data.reduce((sum, item) => sum + item.totalAmount, 0);
    setTotalAmount(total);
  };

  useEffect(() => {
    fetchTotalPrices();
  }, []);

  useEffect(() => {
    filterDataByDate(selectedDate);
  }, [selectedDate, originalData]);

  const handleUserIdSearch = () => {
    if (userId) {
      fetchEmployeeDetails(userId);
    }
  };

  const handleCopyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      alert('User ID copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const generateExcelReport = () => {
    if (totalPrices.length === 0) {
      alert('No data available to generate Excel report.');
      return;
    }

    // Prepare data for Excel
    const data = totalPrices.map(item => ({
      'User ID': item.userId || "N/A", // Default to "N/A" if userId is undefined
      'Table Number': item.tableNum,
      'Total Amount': parseFloat(item.totalAmount).toFixed(2),
      'Date': new Date(item.date).toISOString().split('T')[0],
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Total Prices');

    // Export the Excel file
    XLSX.writeFile(workbook, 'total_prices_report.xlsx');
  };

  // Find the row with the highest total amount
  const highestTotalAmount = totalPrices.length > 0 ? Math.max(...totalPrices.map(item => item.totalAmount)) : null;

  return (
    <div
    style={{ 
      backgroundImage: `url(${bgAdmin})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
    }}>
      <AdminNaviBar selectedPage="In Restaurant Management" />
      <Sidebar />  

      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-thin mb-6 text-center">Total Price Calculator</h1>

        <div className="text-center mb-4">
          <h2 className="text-xl">Total Amount: Rs. <strong className='text-4xl font-light'>{totalAmount.toFixed(2)}</strong> </h2>
        </div>

        <div className='flex justify-evenly mt-10'>

          <div className="flex justify-center mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white p-2 rounded-md"
            />
          </div>

          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Paste User Id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white p-2 rounded-md mr-2"
            />
            <button
              onClick={handleUserIdSearch}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md"
            >
              Search
            </button>
          </div>

          <div className="flex justify-center mb-6 ml-3">
          <button
            onClick={generateExcelReport}
            className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-md"
          >
            Download As Xl <FontAwesomeIcon icon={faFileExcel} className='ml-2' />
          </button>
        </div>

        </div>

        {loading && <p className="text-center text-yellow-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {employeeData && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-bold">Employee Details</h2>
            <p><strong>Name:</strong> {employeeData.EmployeeName}</p>
            <p><strong>Email:</strong> {employeeData.EmployeeEmail}</p>
            <p><strong>Age:</strong> {employeeData.EmployeeAge}</p>
            <p><strong>Position:</strong> {employeeData.EmployeePosition}</p>
            <p><strong>Salary:</strong> {employeeData.Salary}</p>
            <p><strong>Contact:</strong> {employeeData.Contact}</p>
            <p><strong>Employee ID:</strong> {employeeData.employeeID}</p>
            <button onClick={() => handleCopyToClipboard(employeeData.employeeID)} className="mt-2 bg-green-600 hover:bg-green-500 text-white p-2 rounded-md">
              Copy Employee ID
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Table Number</th>
                <th className="px-4 py-2">Total Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {totalPrices.length > 0 ? (
                totalPrices.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-600 ${item.totalAmount === highestTotalAmount ? 'bg-yellow-900 border border-yellow-700' : ''}`}>
                    <td className="px-4 py-2">
                      {item.userId} 
                      {item.totalAmount === highestTotalAmount && ' ⭐ MVP'}
                      <button onClick={() => handleCopyToClipboard(item.userId)} className="ml-2 text-blue-500">Copy ID</button>
                    </td>
                    <td className="px-4 py-2">{item.tableNum}</td>
                    <td className="px-4 py-2">
                      Rs.{item.totalAmount.toFixed(2)} 
                      {item.totalAmount === highestTotalAmount && ' ⭐'}
                    </td>
                    <td className="px-4 py-2">{new Date(item.date).toISOString().split('T')[0]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">No data available for this date.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default TotalPriceCalculator;
