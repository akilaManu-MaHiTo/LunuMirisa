import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import EditEmployeeForm from './EditEmployeeForm';
import AddEmployeeForm from './AddEmployeeForm';
import { useNavigate } from 'react-router-dom';
import AdminNavigationBar from './Components/AdminNavigationBar';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png'

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

  // Validate age function
  const isValidAge = (age) => {
    const ageNumber = parseInt(age, 10);
    return ageNumber >= 18 && ageNumber <= 70;
  };

  // Validate mobile number function
  const isValidMobileNumber = (number) => {
    const mobileRegex = /^\d{10}$/; // Regex to check for exactly 10 digits
    return mobileRegex.test(number);
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
    const { EmployeeAge, Contact } = updatedEmployee;

    // Validate age and contact
    if (!isValidAge(EmployeeAge)) {
      alert('Age must be between 18 and 70.');
      return;
    }

    if (!isValidMobileNumber(Contact)) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

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

  // PDF generation function
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add logo to the top-left corner
    const img = new Image();
    img.src = logo; // Path to your logo image
    doc.addImage(img, 'PNG', 10, 10, 25, 20); // Adjust logo size and position
  
    // Centered title for the report
    doc.setFontSize(16);
    doc.text('Accepted Orders Report', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' }); // Adjust Y position
  
    // Right corner contact info with smaller font size
    doc.setFontSize(7); // Smaller font size for the contact info
    const todayDate = new Date().toLocaleDateString(); // Get today's date
    doc.text([  
        'Email: lunumirisasrilanka@gmail.com',
        'Tel: 0766670918',
        'Facebook: lunumirisa',
        `Date: ${todayDate}`
    ], doc.internal.pageSize.getWidth() - 50, 20); // Adjust the X position
  
    // Add a line below the header to separate content
    doc.line(10, 35, doc.internal.pageSize.getWidth() - 10, 35); // Adjust Y position of the line
  
    // Table headers and rows
    const headers = [['Employee ID', 'Name', 'Email', 'Age', 'Position', 'Salary', 'Contact']];
    const rows = filteredEmployees.map((employee) => [
      employee._id,
      employee.EmployeeName,
      employee.EmployeeEmail,
      employee.EmployeeAge,
      employee.EmployeePosition,
      employee.Salary,
      employee.Contact
    ]);
  
    // Add table after the header, with adjusted margin
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 40, // Ensure the table starts after the header and line
      headStyles: {
        fillColor: [4, 73, 71], // Your custom header color
        textColor: [255, 255, 255], // White text for the header
        halign: 'center',
        fontSize: 10,
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 8, // Smaller text for the body
      },
      alternateRowStyles: {
        fillColor: [255, 244, 181], // Alternate row fill color
      },
    });
  
    doc.save('employee_report.pdf');
  };

  return (
    <div className="bg-custom-toolight h-screen">
      <AdminNavigationBar selectedPage="Manage Employees" />
      <Sidebar />

      <div className={`${showAddForm ? 'blur-md' : ''} container mx-auto p-10`}>
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or age"
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
            className="bg-black hover:bg-white hover:text-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition duration-300 ease-in-out"
          >
            <PlusIcon className="h-5 w-5" />
            Add Employee
          </button>

          {/* PDF Download Button */}
          <button
            onClick={downloadPDF}
            className="bg-blue-500 hover:bg-white hover:text-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition duration-300 ease-in-out"
          >
            <FontAwesomeIcon icon={faDownload} className="h-5 w-5" />
            Download Report
          </button>
        </div>

        {/* Render Edit Form Below the Search Bar */}
        {editEmployee && (
          <EditEmployeeForm
            employee={editEmployee}
            onSave={handleSaveEdit}
            onCancel={() => {
              setEditEmployee(null); // Reset the selected employee
            }}
          />
        )}

        {/* Employee Table */}
        <table className="min-w-full text-white bg-custom-dark rounded-lg shadow-xl border border-white">
          <thead>
            <tr className='border border-white'>
              <th className="px-4 py-2">Employee ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Leave</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id} className='border border-white'>
                <td className="px-4 py-2">{employee._id}</td>
                <td className="px-4 py-2">{employee.EmployeeName}</td>
                <td className="px-4 py-2">{employee.EmployeeEmail}</td>
                <td className="px-4 py-2">{employee.EmployeeAge}</td>
                <td className="px-4 py-2">{employee.EmployeePosition}</td>
                <td className="px-4 py-2">{employee.Salary}</td>
                <td className="px-4 py-2">{employee.Contact}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleLeaveClick(employee._id)}>View Leaves</button>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleEdit(employee)}>
                    <PencilIcon className="h-5 w-5 text-green-500" />
                  </button>
                  <button onClick={() => handleDelete(employee._id)}>
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
