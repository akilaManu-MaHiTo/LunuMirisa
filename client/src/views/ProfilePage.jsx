import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetails = () => {
  const { userId } = useParams(); // Get userId from params
  const [employee, setEmployee] = useState(null);
  const [epf, setEpf] = useState(0);
  const [eps, setEps] = useState(0);
  const [salaryAfterEps, setSalaryAfterEps] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch employee details by userId
    axios.get(`http://localhost:3001/employee/${userId}`)
      .then(response => {
        const employeeData = response.data;
        setEmployee(employeeData);
        calculateEPFAndEPS(employeeData.Salary);
      })
      .catch(err => {
        setError(err.response ? err.response.data.message : 'Error fetching data');
      });
  }, [userId]);

  const calculateEPFAndEPS = (salary) => {
    if (salary) {
      const salaryValue = parseFloat(salary);
      const epfAmount = salaryValue * 0.0367; // 3.67% for EPF
      const epsAmount = salaryValue * 0.0833; // 8.33% for EPS
      setEpf(epfAmount);
      setEps(epsAmount);
      setSalaryAfterEps(salaryValue - epsAmount);
    }
  };

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (!employee) {
    return <p className="text-blue-400">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-white">Employee Details</h1>
      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4 text-white">Employee Details</h2>
        <div className="grid grid-cols-4 md:grid-cols-3 gap-9" style={{ width: '900px' }}>
          <div className="flex flex-col gap-1 text-white"><strong>Name:</strong> {employee.EmployeeName}</div>
          <div className="flex flex-col gap-1 text-white"><strong>Email:</strong> {employee.EmployeeEmail}</div>
          <div className="flex flex-col gap-1 text-white"><strong>Age:</strong> {employee.EmployeeAge}</div>
          <div className="flex flex-col gap-1 text-white"><strong>Position:</strong> {employee.EmployeePosition}</div>
          <div className="flex flex-col gap-1 text-white"><strong>Salary:</strong> ${employee.Salary}</div>
          <div className="flex flex-col gap-1 text-white"><strong>Contact:</strong> {employee.Contact}</div>
        </div>
        <div className="mt-2 text-white" style={{ marginTop: '30px' }}>
          <p><strong>EPF (3.67%):</strong> ${epf.toFixed(2)}</p>
          <p><strong>EPS (8.33%):</strong> ${eps.toFixed(2)}</p>
          <p><strong>Salary after EPS Deduction:</strong> ${salaryAfterEps.toFixed(2)}</p>

          <p className="mt-6 text-gray-400 text-sm">
            ***EPF (Employees' Provident Fund) is a mandatory retirement savings scheme. 
            EPS (Employees' Pension Scheme) provides pension benefits to employees after retirement. 
            Calculations are based on current percentages and may be subject to change.***
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
