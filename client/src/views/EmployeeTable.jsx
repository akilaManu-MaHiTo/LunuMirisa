import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditEmployeeForm from './EditEmployeeForm';
import AddEmployeeForm from './AddEmployeeForm';
import { useNavigate } from 'react-router-dom';
import AdminNavigationBar from './Components/AdminNavigationBar';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // For searching
  const [filterPosition, setFilterPosition] = useState(''); // For position filter
  const [showAddForm, setShowAddForm] = useState(false); // For toggling the add form
  const navigate = useNavigate();

  const handleAddEmployeeClick = () => {
    navigate('/addemployee'); // Replace '/add-employee' with the path to your new page
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Delete an employee
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await axios.delete(`http://localhost:3001/employee/${id}`);
        if (response.status === 200) {
          alert('Employee deleted successfully');
          fetchEmployees(); // Refresh the list after deletion
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  // Open edit form for an employee
  const handleEdit = (employee) => {
    setEditEmployee(employee);
  };

  // Save edited employee
  const handleSaveEdit = async (updatedEmployee) => {
    try {
      await axios.put(`http://localhost:3001/employee/${updatedEmployee._id}`, updatedEmployee);
      setEditEmployee(null); // Close the edit form after saving
      fetchEmployees(); // Refresh the list after editing
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Navigate to the leave list of the selected employee
  const handleLeaveClick = (employeeId) => {
    navigate(`/leaves/${employeeId}`);
  };

  // Filter and search employees
  const filteredEmployees = employees
    .filter((employee) =>
      (employee.EmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.EmployeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.EmployeeAge.toString().includes(searchQuery))
    )
    .filter((employee) => 
      filterPosition === '' || employee.EmployeePosition === filterPosition
    );

  return (
    <div className="relative">
      <AdminNavigationBar selectedPage="Manage Employees" />
      {/* Search and Table Section with Conditional Blur */}
      <div className={`${showAddForm ? 'blur-md' : ''} container mx-auto p-6`}>
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, email, or age"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg mb-4 md:mb-0 md:mr-4"
            style={{width: '400px'}}
          />

          {/* Filter by Position */}
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg mb-4 md:mb-0 md:mr-4"
          >
            <option value="">All Positions</option>
            <option value="Waiter">Waiter</option>
            <option value="Staff Member">Staff Member</option>
            <option value="Employee Manager">Employee Manager</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Table Reservation Manager">Table Reservation Manager</option>
            <option value="Menu List Manager">Menu List Manager</option>
          </select>

          {/* Add Employee Button */}
          <button
            onClick={handleAddEmployeeClick}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Employee
          </button>
        </div>

        <div style={{width: '700px', marginLeft: '150px'}}>
          {editEmployee && (
            <EditEmployeeForm
              employee={editEmployee}
              onSave={handleSaveEdit}
              onCancel={() => setEditEmployee(null)}
            />
          )}
        </div>

        {/* Employee Table */}
        <table className="min-w-full text-white bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Leave</th> {/* New Leave Column */}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id} className="border-white">
                <td className="px-4 py-2">{employee.EmployeeName}</td>
                <td className="px-4 py-2">{employee.EmployeeEmail}</td>
                <td className="px-4 py-2">{employee.EmployeeAge}</td>
                <td className="px-4 py-2">{employee.EmployeePosition}</td>
                <td className="px-4 py-2">{employee.Salary}</td>
                <td className="px-4 py-2">{employee.Contact}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleLeaveClick(employee._id)} // Navigate to leave list
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                  >
                    View Leave
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conditionally render add employee form with overlay */}
      {showAddForm && (
        <div className="inset-0 flex justify-center items-center bg-black bg-opacity-50" style={{marginTop: '0px'}}>
          <div className="rounded-lg shadow-lg" style={{marginTop: '0px'}}>
            <AddEmployeeForm
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
