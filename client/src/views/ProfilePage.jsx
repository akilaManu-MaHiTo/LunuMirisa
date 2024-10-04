import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { userId } = useParams(); // Get userId from params
  const [employee, setEmployee] = useState(null);
  const [epf, setEpf] = useState(0);
  const [eps, setEps] = useState(0);
  const [salaryAfterEps, setSalaryAfterEps] = useState(0);
  const [error, setError] = useState(null);
  const [leaveType, setLeaveType] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveError, setLeaveError] = useState(null);
  const [leaveSuccess, setLeaveSuccess] = useState(null);
  const [appliedLeaves, setAppliedLeaves] = useState([]); 

  const leaveTypes = ["Sick Leave", "Casual Leave", "Earned Leave", "Maternity Leave", "Paternity Leave"]; 

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

    // Fetch applied leaves for the employee
    fetchAppliedLeaves();
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

  const fetchAppliedLeaves = () => {
    axios.get(`http://localhost:3001/leaves/${userId}`) 
      .then(response => {
        setAppliedLeaves(response.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleLeaveApply = (e) => {
    e.preventDefault();

    // Validation for dates
    const today = new Date();
    const startDate = new Date(leaveStartDate);
    const endDate = new Date(leaveEndDate);

    if (startDate < today || endDate < today) {
        setLeaveError('Leave dates cannot be in the past.');
        return;
    }

    if (startDate > endDate) {
        setLeaveError('End date must be after the start date.');
        return;
    }

    // Format the dates to YYYY-MM-DD
    const formattedLeaveStartDate = startDate.toISOString().slice(0, 10);
    const formattedLeaveEndDate = endDate.toISOString().slice(0, 10);

    const leaveData = {
        employeeID: userId,
        leaveType,
        leaveStartDate: formattedLeaveStartDate, 
        leaveEndDate: formattedLeaveEndDate, 
    };

    axios.post('http://localhost:3001/applyleave', leaveData)
        .then(response => {
            setLeaveSuccess('Leave applied successfully!');
            setLeaveError(null);
            fetchAppliedLeaves();
        })
        .catch(err => {
            setLeaveError(err.response ? err.response.data.message : 'Error applying for leave');
            setLeaveSuccess(null);
        });
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

      {/* Leave Application Form */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4 text-white">Apply for Leave</h2>
        <form onSubmit={handleLeaveApply}>
          <div className="mb-4">
            <label className="block text-white" htmlFor="leaveType">Leave Type:</label>
            <select 
              id="leaveType" 
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required 
            >
              <option value="" disabled>Select Leave Type</option>
              {leaveTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-white" htmlFor="leaveStartDate">Start Date:</label>
            <input 
              type="date" 
              id="leaveStartDate" 
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              value={leaveStartDate}
              onChange={(e) => setLeaveStartDate(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-white" htmlFor="leaveEndDate">End Date:</label>
            <input 
              type="date" 
              id="leaveEndDate" 
              className="mt-1 block w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              value={leaveEndDate}
              onChange={(e) => setLeaveEndDate(e.target.value)}
              required 
            />
          </div>
          {leaveError && <p className="text-red-400 mb-4">{leaveError}</p>}
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Apply Leave
          </button>
        </form>

        {leaveSuccess && <p className="text-green-400 mt-4">{leaveSuccess}</p>}
      </div>

      {/* Applied Leave Details */}
      // Applied Leave Details
<div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-3xl w-full">
  <h2 className="text-2xl font-semibold mb-4 text-white">Applied Leave Details</h2>
  {appliedLeaves.length > 0 ? (
    <table className="min-w-full divide-y divide-gray-700">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-white">Leave ID</th> 
          <th className="px-4 py-2 text-left text-white">Leave Type</th>
          <th className="px-4 py-2 text-left text-white">Start Date</th>
          <th className="px-4 py-2 text-left text-white">End Date</th>
          <th className="px-4 py-2 text-left text-white">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-600">
        {appliedLeaves.map((leave, index) => (
          <tr key={index}>
            <td className="px-4 py-2 text-white">{leave._id}</td> 
            <td className="px-4 py-2 text-white">{leave.leaveType}</td>
            <td className="px-4 py-2 text-white">{new Date(leave.leaveStartDate).toLocaleDateString()}</td>
            <td className="px-4 py-2 text-white">{new Date(leave.leaveEndDate).toLocaleDateString()}</td>
            <td className="px-4 py-2 text-white">{leave.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-gray-400">No applied leaves found.</p>
  )}
</div>


    </div>
  );
};

export default ProfilePage;
