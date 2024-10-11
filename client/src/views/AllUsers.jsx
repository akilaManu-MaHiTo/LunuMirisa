import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/Logo.png'

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/allUsers");
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:3001/deleteSiteUsers/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const filteredUsers = users.filter(user => {
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const email = user.email || '';
        
        return (
            firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const generateReport = () => {
        const doc = new jsPDF();
      
        // Add logo to the top-left corner
        const img = new Image();
        img.src = logo; // Path to your logo image
        doc.addImage(img, 'PNG', 10, 10, 25, 20); // Adjust logo size and position
      
        // Centered title for the report
        doc.setFontSize(16);
        doc.text('User Report', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' }); // Adjust Y position
      
        // Right corner contact info with smaller font size
        doc.setFontSize(7); // Smaller font size for the contact info
        const todayDate = new Date().toLocaleDateString(); // Get today's date
        doc.text([
            'Email: lunumirisasrilanka@gmail.com',
            'Tel: 0766670918',
            'Facebook: lunumirisa',
            `Date: ${todayDate}`
        ], doc.internal.pageSize.getWidth() - 50, 20); // Adjust the X position for contact info
      
        // Add a line below the header to separate content
        doc.line(10, 35, doc.internal.pageSize.getWidth() - 10, 35); // Adjust Y position of the line
      
        // Table headers and rows
        const tableColumn = ["First Name", "Last Name", "Email", "Verified"];
        const tableRows = [];
      
        filteredUsers.forEach(user => {
          const userData = [
            user.firstName,
            user.lastName,
            user.email,
            user.verified ? 'Yes' : 'No'
          ];
          tableRows.push(userData);
        });
      
        // Add table after the header, with adjusted margin
        doc.autoTable({
          head: [tableColumn], // Table column headers
          body: tableRows, // Table rows
          startY: 40, // Ensure the table starts after the header
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
      
        // Save the PDF
        doc.save('User_Report.pdf');
      };
      

    if (loading) {
        return <div className="text-center text-lg text-gray-400">Loading...</div>;
    }

    return (
        <div className='bg-gray-900 h-screen'>
            <AdminNaviBar selectedPage="User Managment" />
            <Sidebar />  

            
            <div className=" bg-gray-900 w-full p-10 h-[60rem] text-white">
                <h1 className="text-3xl pl-3 font-thin my-8"> <FontAwesomeIcon icon={faUser} className='mr-3' /> All Users</h1>
                <div className='flex justify-between'>
                    <div className="mb-4 w-64">
                        <input
                            type="text"
                            className="border border-gray-700 rounded-md p-2 w-52 bg-gray-800 text-white"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={generateReport}
                        className="bg-blue-500 text-black font-semibold py-2 px-4 rounded hover:bg-blue-700 hover:text-white  transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg "
                    >
                        Download Report <FontAwesomeIcon icon={faDownload} className='ml-3'/>
                    </button>                    
                </div>

                <table className="min-w-full border-collapse border border-gray-700 mt-4 mb-20">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border border-gray-700 p-2">First Name</th>
                            <th className="border border-gray-700 p-2">Last Name</th>
                            <th className="border border-gray-700 p-2">Email</th>
                            <th className="border border-gray-700 p-2">Verified</th>
                            <th className="border border-gray-700 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-gray-700">
                                <td className="border border-gray-700 p-2">{user.firstName}</td>
                                <td className="border border-gray-700 p-2">{user.lastName}</td>
                                <td className="border border-gray-700 p-2">{user.email}</td>
                                <td className="border border-gray-700 p-2 text-center">{user.verified ? 'Yes' : 'No'}</td>
                                <td className="border border-gray-700 py-3 text-center">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="bg-red-500 text-black py-1 px-3 rounded hover:bg-red-700 hover:text-white transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg mx-auto"
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} className='mr-3' />Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>

                </div>
            </div>
        </div>
    );
};

export default AllUsers;
