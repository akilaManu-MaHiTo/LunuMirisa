// // src/components/EditEmployeeForm.js
// import React, { useState } from 'react';

// const EditEmployeeForm = ({ employee, onSave, onCancel }) => {
//   const [formData, setFormData] = useState({
//     EmployeeName: employee.EmployeeName,
//     EmployeeEmail: employee.EmployeeEmail,
//     EmployeeAge: employee.EmployeeAge,
//     EmployeePosition: employee.EmployeePosition,
//     Salary: employee.Salary,
//     Contact: employee.Contact,
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({ ...employee, ...formData });
//   };

//   return (
//     <div className="bg-gray-100 p-6 mb-4 rounded-lg shadow-lg">
//       <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700">Employee Name</label>
//           <input
//             type="text"
//             name="EmployeeName"
//             value={formData.EmployeeName}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Employee Email</label>
//           <input
//             type="email"
//             name="EmployeeEmail"
//             value={formData.EmployeeEmail}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Employee Age</label>
//           <input
//             type="number"
//             name="EmployeeAge"
//             value={formData.EmployeeAge}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Employee Position</label>
//           <select
//             name="EmployeePosition"
//             value={formData.EmployeePosition}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//           >
//             <option value="Chef">Chef</option>
//             <option value="Manager">Manager</option>
//             <option value="Waiter">Waiter</option>
//             <option value="Helper">Helper</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Salary</label>
//           <input
//             type="text"
//             name="Salary"
//             value={formData.Salary}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Contact Number</label>
//           <input
//             type="tel"
//             name="Contact"
//             value={formData.Contact}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             required
//           />
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditEmployeeForm;


import React, { useState } from 'react';

const EditEmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    EmployeeName: employee.EmployeeName,
    EmployeeEmail: employee.EmployeeEmail,
    EmployeeAge: employee.EmployeeAge,
    EmployeePosition: employee.EmployeePosition,
    Salary: employee.Salary,
    Contact: employee.Contact,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...employee, ...formData });
  };

  return (
    <div className="bg-gray-100 p-6 mb-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3"> {/* Grid layout with 2 columns and increased gap */}
          {/* Employee Name */}
          <div className="mb-4 col-span-1">
            <label className="block text-gray-700">Employee Name</label>
            <input
              type="text"
              name="EmployeeName"
              value={formData.EmployeeName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Employee Email */}
          <div className="mb-4 col-span-1">
            <label className="block text-gray-700">Employee Email</label>
            <input
              type="email"
              name="EmployeeEmail"
              value={formData.EmployeeEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Employee Age */}
          <div className="mb-4 col-span-1">
            <label className="block text-gray-700">Employee Age</label>
            <input
              type="number"
              name="EmployeeAge"
              value={formData.EmployeeAge}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Employee Position */}
          <div className="mb-4 col-span-1">
            <label className="block text-gray-700">Employee Position</label>
            <select
              name="EmployeePosition"
              value={formData.EmployeePosition}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="Chef">Chef</option>
              <option value="Manager">Manager</option>
              <option value="Waiter">Waiter</option>
              <option value="Helper">Helper</option>
            </select>
          </div>

          {/* Salary */}
          <div className="mb-4 col-span-1">
            <label className="block text-gray-700">Salary</label>
            <input
              type="text"
              name="Salary"
              value={formData.Salary}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="mb-4 col-span-1">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="tel"
              name="Contact"
              value={formData.Contact}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex mt-6 w-full gap-x-2">
  <button
    type="button"
    onClick={onCancel}
    className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 flex-1"
  >
    Cancel
  </button>
  <button
    type="submit"
    className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex-1"
  >
    Save
  </button>
</div>
      </form>
    </div>
  );
};

export default EditEmployeeForm;
