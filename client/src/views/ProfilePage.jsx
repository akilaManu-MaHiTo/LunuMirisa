// // // // import React, { useState } from 'react';
// // // // import axios from 'axios';

// // // // const ProfilePage = () => {
// // // //   const [userId, setUserId] = useState('');
// // // //   const [userDetails, setUserDetails] = useState(null);
// // // //   const [etfAmount, setEtfAmount] = useState(0);

// // // //   const handleFetchDetails = async () => {
// // // //     if (!userId) return;
// // // //     try {
// // // //       const response = await axios.get(`http://localhost:3001/employee/${userId}`);
// // // //       setUserDetails(response.data);
// // // //       // Calculate 3% of ETF
// // // //       const calculatedEtf = response.data.ETF * 0.03;
// // // //       setEtfAmount(calculatedEtf);
// // // //     } catch (error) {
// // // //       console.error('Error fetching user details:', error);
// // // //       // Handle errors (e.g., user not found)
// // // //       setUserDetails(null);
// // // //       setEtfAmount(0);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="p-6">
// // // //       <h1 className="text-2xl font-bold mb-4">User Profile</h1>

// // // //       {/* User ID Input */}
// // // //       <div className="mb-4">
// // // //         <input
// // // //           type="text"
// // // //           placeholder="Enter User ID"
// // // //           value={userId}
// // // //           onChange={(e) => setUserId(e.target.value)}
// // // //           className="p-2 border border-gray-300 rounded-lg w-full"
// // // //         />
// // // //         <button
// // // //           onClick={handleFetchDetails}
// // // //           className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
// // // //         >
// // // //           Fetch Details
// // // //         </button>
// // // //       </div>

// // // //       {/* User Details Card */}
// // // //       {userDetails && (
// // // //         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
// // // //           <h2 className="text-xl font-bold mb-4">User Information</h2>
// // // //           <div className="grid grid-cols-2 gap-6">
// // // //             <div>
// // // //               <p className="font-semibold">Name:</p>
// // // //               <p>{userDetails.EmployeeName}</p>
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-semibold">Email:</p>
// // // //               <p>{userDetails.EmployeeEmail}</p>
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-semibold">Age:</p>
// // // //               <p>{userDetails.EmployeeAge}</p>
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-semibold">Position:</p>
// // // //               <p>{userDetails.EmployeePosition}</p>
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-semibold">Salary:</p>
// // // //               <p>{userDetails.Salary}</p>
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-semibold">Contact:</p>
// // // //               <p>{userDetails.Contact}</p>
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-semibold">ETF (3% Calculation):</p>
// // // //               <p>{etfAmount.toFixed(2)}</p>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ProfilePage;


// // // // src/components/ProfilePage.js
// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';

// // // const ProfilePage = () => {
// // //   const [employee, setEmployee] = useState(null);
// // //   const [userId, setUserId] = useState('');
// // //   const [epf, setEpf] = useState(0);
// // //   const [eps, setEps] = useState(0);

// // //   useEffect(() => {
// // //     if (userId) {
// // //       fetchEmployeeDetails(userId);
// // //     }
// // //   }, [userId]);

// // //   const fetchEmployeeDetails = async (id) => {
// // //     try {
// // //       const response = await axios.get(`http://localhost:3001/employee/${id}`);
// // //       setEmployee(response.data);
// // //       calculateEPFAndEPS(response.data.Salary);
// // //     } catch (error) {
// // //       console.error('Error fetching employee details:', error);
// // //     }
// // //   };

// // //   const calculateEPFAndEPS = (salary) => {
// // //     if (salary) {
// // //       const salaryValue = parseFloat(salary);
// // //       const epfAmount = salaryValue * 0.0367; // 3.67% for EPF
// // //       const epsAmount = salaryValue * 0.0833; // 8.33% for EPS
// // //       setEpf(epfAmount);
// // //       setEps(epsAmount);
// // //     }
// // //   };

// // //   const handleInputChange = (e) => {
// // //     setUserId(e.target.value);
// // //   };

// // //   return (
// // //     <div className="p-6 bg-gray-100 min-h-screen">
// // //       <h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
// // //       <input
// // //         type="text"
// // //         value={userId}
// // //         onChange={handleInputChange}
// // //         placeholder="Enter Employee ID"
// // //         className="p-2 border border-gray-300 rounded-lg mb-4"
// // //       />
// // //       <button
// // //         onClick={() => fetchEmployeeDetails(userId)}
// // //         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
// // //       >
// // //         Fetch Details
// // //       </button>
// // //       {employee && (
// // //         <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
// // //           <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
// // //           <p><strong>Name:</strong> {employee.EmployeeName}</p>
// // //           <p><strong>Email:</strong> {employee.EmployeeEmail}</p>
// // //           <p><strong>Age:</strong> {employee.EmployeeAge}</p>
// // //           <p><strong>Position:</strong> {employee.EmployeePosition}</p>
// // //           <p><strong>Salary:</strong> {employee.Salary}</p>
// // //           <p><strong>Contact:</strong> {employee.Contact}</p>
// // //           <h3 className="text-lg font-semibold mt-4">EPF and EPS Calculations</h3>
// // //           <p><strong>EPF (3.67%):</strong> ${epf.toFixed(2)}</p>
// // //           <p><strong>EPS (8.33%):</strong> ${eps.toFixed(2)}</p>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ProfilePage;
// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const ProfilePage = () => {
// //   const [employee, setEmployee] = useState(null);
// //   const [userId, setUserId] = useState('');
// //   const [epf, setEpf] = useState(0);
// //   const [eps, setEps] = useState(0);
// //   const [salaryAfterEps, setSalaryAfterEps] = useState(0);

// //   useEffect(() => {
// //     if (userId) {
// //       fetchEmployeeDetails(userId);
// //     }
// //   }, [userId]);

// //   const fetchEmployeeDetails = async (id) => {
// //     try {
// //       const response = await axios.get(`http://localhost:3001/employee/${id}`);
// //       setEmployee(response.data);
// //       calculateEPFAndEPS(response.data.Salary);
// //     } catch (error) {
// //       console.error('Error fetching employee details:', error);
// //     }
// //   };

// //   const calculateEPFAndEPS = (salary) => {
// //     if (salary) {
// //       const salaryValue = parseFloat(salary);
// //       const epfAmount = salaryValue * 0.0367; // 3.67% for EPF
// //       const epsAmount = salaryValue * 0.0833; // 8.33% for EPS
// //       setEpf(epfAmount);
// //       setEps(epsAmount);
// //       setSalaryAfterEps(salaryValue - epsAmount);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     setUserId(e.target.value);
// //   };

// //   return (
// //     <div className="p-6 bg-gray-100 min-h-screen">
// //       <h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
// //       <input
// //         type="text"
// //         value={userId}
// //         onChange={handleInputChange}
// //         placeholder="Enter Employee ID"
// //         className="p-2 border border-gray-300 rounded-lg mb-4"
// //       />
// //       <button
// //         onClick={() => fetchEmployeeDetails(userId)}
// //         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
// //       >
// //         Fetch Details
// //       </button>
// //       {employee && (
// //         <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
// //           <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
// //           <p><strong>Name:</strong> {employee.EmployeeName}</p>
// //           <p><strong>Email:</strong> {employee.EmployeeEmail}</p>
// //           <p><strong>Age:</strong> {employee.EmployeeAge}</p>
// //           <p><strong>Position:</strong> {employee.EmployeePosition}</p>
// //           <p><strong>Salary:</strong> {employee.Salary}</p>
// //           <p><strong>Contact:</strong> {employee.Contact}</p>
// //           <h3 className="text-lg font-semibold mt-4">EPF and EPS Calculations</h3>
// //           <p><strong>EPF (3.67%):</strong> ${epf.toFixed(2)}</p>
// //           <p><strong>EPS (8.33%):</strong> ${eps.toFixed(2)}</p>
// //           <p><strong>Salary after EPS Deduction:</strong> ${salaryAfterEps.toFixed(2)}</p>
// //           <p className="mt-4 text-gray-700 text-sm">
// //             * EPF (Employees' Provident Fund) is a mandatory retirement savings scheme. 
// //             * EPS (Employees' Pension Scheme) provides pension benefits to employees after retirement. 
// //             * Calculations are based on current percentages and may be subject to change.
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ProfilePage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ProfilePage = () => {
//   const [employee, setEmployee] = useState(null);
//   const [userId, setUserId] = useState('');
//   const [epf, setEpf] = useState(0);
//   const [eps, setEps] = useState(0);
//   const [salaryAfterEps, setSalaryAfterEps] = useState(0);

//   useEffect(() => {
//     if (userId) {
//       fetchEmployeeDetails(userId);
//     }
//   }, [userId]);

//   const fetchEmployeeDetails = async (id) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/employee/${id}`);
//       setEmployee(response.data);
//       calculateEPFAndEPS(response.data.Salary);
//     } catch (error) {
//       console.error('Error fetching employee details:', error);
//     }
//   };

//   const calculateEPFAndEPS = (salary) => {
//     if (salary) {
//       const salaryValue = parseFloat(salary);
//       const epfAmount = salaryValue * 0.0367; // 3.67% for EPF
//       const epsAmount = salaryValue * 0.0833; // 8.33% for EPS
//       setEpf(epfAmount);
//       setEps(epsAmount);
//       setSalaryAfterEps(salaryValue - epsAmount);
//     }
//   };

//   const handleInputChange = (e) => {
//     setUserId(e.target.value);
//   };

//   return (
//     <div className="p-5 bg-gray-100 ">
//       <h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
//       <input
//         type="text"
//         value={userId}
//         onChange={handleInputChange}
//         placeholder="Enter Employee ID"
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <button
//         onClick={() => fetchEmployeeDetails(userId)}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//       >
//         Fetch Details
//       </button>
//       {employee && (
//         <div className="mt-6 bg-white p-6 rounded-lg shadow-xl border border-gray-300" style={{width:'500px'}}>
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Employee Details</h2>
//           <div className="grid grid-cols-2 gap-6">
//             <div><strong>Name:</strong> {employee.EmployeeName}</div>
//             <div><strong>Email:</strong> {employee.EmployeeEmail}</div>
//             <div><strong>Age:</strong> {employee.EmployeeAge}</div>
//             <div><strong>Position:</strong> {employee.EmployeePosition}</div>
//             <div><strong>Salary:</strong> ${employee.Salary}</div>
//             <div><strong>Contact:</strong> {employee.Contact}</div>
//           </div>
//           <h3 className="text-xl font-semibold mt-6 text-gray-800">EPF and EPS Calculations</h3>
//           <div className="mt-2">
//             <p><strong>EPF (3.67%):</strong> ${epf.toFixed(2)}</p>
//             <p><strong>EPS (8.33%):</strong> ${eps.toFixed(2)}</p>
//             <p><strong>Salary after EPS Deduction:</strong> ${salaryAfterEps.toFixed(2)}</p>
//           </div>
//           <p className="mt-6 text-gray-600 text-sm">
//             * EPF (Employees' Provident Fund) is a mandatory retirement savings scheme. 
//             * EPS (Employees' Pension Scheme) provides pension benefits to employees after retirement. 
//             * Calculations are based on current percentages and may be subject to change.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

// 

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [userId, setUserId] = useState('');
  const [epf, setEpf] = useState(0);
  const [eps, setEps] = useState(0);
  const [salaryAfterEps, setSalaryAfterEps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchEmployeeDetails(userId);
    }
  }, [userId]);

  const fetchEmployeeDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/employee/${id}`);
      setEmployee(response.data);
      calculateEPFAndEPS(response.data.Salary);
    } catch (error) {
      setError('Error fetching employee details. Please try again.');
      console.error('Error fetching employee details:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-white">Employee Profile</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          value={userId}
          onChange={handleInputChange}
          placeholder="Enter Employee ID"
          className="p-3 border border-gray-700 rounded-lg shadow-sm text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <button
          onClick={() => fetchEmployeeDetails(userId)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Fetch Details
        </button>
      </div>
      {loading && <p className="text-blue-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {employee && !loading && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-3xl w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">Employee Details</h2>
          <div className="grid grid-cols-4 md:grid-cols-3 gap-9" style={{width:'900px'}}>
            <div className="flex flex-col gap-1 text-white"><strong>Name:</strong> {employee.EmployeeName}</div>
            <div className="flex flex-col gap-1 text-white"><strong>Email:</strong> {employee.EmployeeEmail}</div>
            <div className="flex flex-col gap-1 text-white"><strong>Age:</strong> {employee.EmployeeAge}</div>
            <div className="flex flex-col gap-1 text-white"><strong>Position:</strong> {employee.EmployeePosition}</div>
            <div className="flex flex-col gap-1 text-white"><strong>Salary:</strong> ${employee.Salary}</div>
            <div className="flex flex-col gap-1 text-white"><strong>Contact:</strong> {employee.Contact}</div>
          </div>
          <div className="mt-2 text-white" style={{marginTop:'30px'}}>
            <p><strong>EPF (3.67%):</strong> ${epf.toFixed(2)}</p>
            <p><strong>EPS (8.33%):</strong> ${eps.toFixed(2)}</p>
            <p><strong>Salary after EPS Deduction:</strong> ${salaryAfterEps.toFixed(2)}</p>
         
          <p className="mt-6 text-gray-400 text-sm">
            ***EPF (Employees' Provident Fund) is a mandatory retirement savings scheme. 
            EPS (Employees' Pension Scheme) provides pension benefits to employees after retirement. 
            Calculations are based on current percentages and may be subject to change.***
          </p>
        </div> </div>
      )}
    </div>
  );
};

export default ProfilePage;
