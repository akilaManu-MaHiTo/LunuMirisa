import React, { useState } from 'react';
import axios from 'axios';
import AdminNavigationBar from './Components/AdminNavigationBar';

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    EmployeeName: '',
    EmployeeEmail: '',
    EmployeeAge: '',
    EmployeePosition: 'Chef', // Default value for the dropdown
    Salary: '',
    Contact: '',
    password: '' 
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    // Validate name (Required)
    if (!formData.EmployeeName.trim()) {
      formErrors.EmployeeName = 'Employee name is required';
    }

    // Validate email (Basic format using regex)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.EmployeeEmail) {
      formErrors.EmployeeEmail = 'Employee email is required';
    } else if (!emailPattern.test(formData.EmployeeEmail)) {
      formErrors.EmployeeEmail = 'Please enter a valid email';
    }

    // Validate age (Must be between 18 and 70)
    if (!formData.EmployeeAge) {
      formErrors.EmployeeAge = 'Employee age is required';
    } else if (formData.EmployeeAge < 18 || formData.EmployeeAge > 70) {
      formErrors.EmployeeAge = 'Employee age must be between 18 and 70';
    }

    // Validate salary (Required)
    if (!formData.Salary.trim()) {
      formErrors.Salary = 'Salary is required';
    }

    // Validate contact (10 digits using regex)
    const contactPattern = /^\d{10}$/;
    if (!formData.Contact) {
      formErrors.Contact = 'Contact number is required';
    } else if (!contactPattern.test(formData.Contact)) {
      formErrors.Contact = 'Contact number must be exactly 10 digits';
    }

    // Validate password (Minimum 6 characters)
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(formErrors);

    // Return true if there are no errors
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('https://lunu-mirisa.vercel.app/addemployee', formData);
        console.log(response.data);
        alert('Employee added successfully!');
        setFormData({
          EmployeeName: '',
          EmployeeEmail: '',
          EmployeeAge: '',
          EmployeePosition: 'Chef', // Reset to default
          Salary: '',
          Contact: '',
          password: '' 
        });
        setErrors({});
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    }
  };

  return (
    <div>
      <AdminNavigationBar selectedPage="Add Employee" />
      <div className="flex justify-center items-center bg-black" style={{ marginTop: '15px' }}>
        <form className="bg-white p-10 rounded-lg shadow-lg my-16" style={{ width: '600px' }} onSubmit={handleSubmit}>
          <h2 className="font-light mb-10 text-3xl text-center" style={{ fontSize: '20px' }}> <strong>Add Employee</strong></h2>

          <div className="grid grid-cols-2 gap-3" style={{ fontSize: '15px' }}>
            {/* Employee Name */}
            <div className="mb-4 col-span-1">
              <label className="block text-gray-700">Employee Name</label>
              <input
                type="text"
                name="EmployeeName"
                value={formData.EmployeeName}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border ${errors.EmployeeName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                placeholder="Enter employee name"
                required
              />
              {errors.EmployeeName && <p className="text-red-500 text-sm mt-1">{errors.EmployeeName}</p>}
            </div>

            {/* Employee Email */}
            <div className="mb-4 col-span-1">
              <label className="block text-gray-700">Employee Email</label>
              <input
                type="email"
                name="EmployeeEmail"
                value={formData.EmployeeEmail}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border ${errors.EmployeeEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                placeholder="Enter employee email"
                required
              />
              {errors.EmployeeEmail && <p className="text-red-500 text-sm mt-1">{errors.EmployeeEmail}</p>}
            </div>

            {/* Employee Age */}
            <div className="mb-4 col-span-1">
              <label className="block text-gray-700">Employee Age</label>
              <input
                type="number"
                name="EmployeeAge"
                value={formData.EmployeeAge}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border ${errors.EmployeeAge ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                placeholder="Enter employee age"
                required
              />
              {errors.EmployeeAge && <p className="text-red-500 text-sm mt-1">{errors.EmployeeAge}</p>}
            </div>

            {/* Contact Number */}
            <div className="mb-4 col-span-1">
              <label className="block text-gray-700">Contact Number</label>
              <input
                type="tel"
                name="Contact"
                value={formData.Contact}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border ${errors.Contact ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                placeholder="Enter contact number"
                required
              />
              {errors.Contact && <p className="text-red-500 text-sm mt-1">{errors.Contact}</p>}
            </div>

            {/* Employee Position (Dropdown) */}
            <div className="mb-4 col-span-1">
              <label className="block text-gray-700">Employee Position</label>
              <select
                name="EmployeePosition"
                value={formData.EmployeePosition}
                onChange={handleChange}
                className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
              >
                <option value="Chef">Chef</option>
                <option value="Waiter">Waiter</option>
                <option value="Staff Member">Staff Member</option>
                <option value="Employee Manager">Employee Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Table Reservation Manager">Table Reservation Manager</option>
                <option value="Menu List Manager">Menu List Manager</option>
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
                className={`w-full p-2 mt-2 border ${errors.Salary ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                placeholder="Enter salary"
                required
              />
              {errors.Salary && <p className="text-red-500 text-sm mt-1">{errors.Salary}</p>}
            </div>

            {/* Password */}
            <div className="mb-4 col-span-1">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 mt-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                placeholder="Enter password"
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className='flex justify-center mt-10'>
              <button
                type="submit"
                className="w-56 h-12 bg-black text-white py-1 rounded-lg hover:bg-white hover:border hover:border-black hover:text-black transition duration-300"
                style={{ marginTop: '10px' }}
              >
                Add Employee
              </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
