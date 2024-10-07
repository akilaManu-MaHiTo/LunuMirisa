import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminNaviBar from './Components/AdminNavigationBar';
import Sidebar from './Components/ToggleSlideBar';
import bgAdmin from '../Images/admin-bg.jpg';

const LeaveList = () => {
  const { employeeId } = useParams(); 
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    leaveId: '',
    status: '',
  });

  const leaveTypes = ["Sick Leave", "Casual Leave", "Earned Leave", "Maternity Leave", "Paternity Leave"];

  // Fetch leave requests for the employee on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    setFilteredLeaves(leaves.filter(leave => {
      const matchesLeaveType = filter.leaveType ? leave.leaveType === filter.leaveType : true;
      const matchesStartDate = filter.startDate ? new Date(leave.leaveStartDate) >= new Date(filter.startDate) : true;
      const matchesEndDate = filter.endDate ? new Date(leave.leaveEndDate) <= new Date(filter.endDate) : true;
      const matchesLeaveId = filter.leaveId ? leave._id === filter.leaveId : true;
      const matchesStatus = filter.status ? leave.status === filter.status : true;

      return matchesLeaveType && matchesStartDate && matchesEndDate && matchesLeaveId && matchesStatus;
    }));
  }, [leaves, filter]);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/leaves/${employeeId}`);
      setLeaves(response.data);
      setFilteredLeaves(response.data); // Set initial filtered leaves
    } catch (error) {
      setError('Error fetching leaves');
      console.error('Error fetching leaves:', error);
    }
  };

  // Handle approving a leave
  const handleApprove = async (leaveId) => {
    try {
      await axios.put(`http://localhost:3001/leaves/approve/${leaveId}`);
      alert('Leave approved successfully');
      fetchLeaves(); // Refresh the list after approval
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  // Handle rejecting a leave
  const handleReject = async (leaveId) => {
    try {
      await axios.put(`http://localhost:3001/leaves/reject/${leaveId}`);
      alert('Leave rejected successfully');
      fetchLeaves(); // Refresh the list after rejection
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  return (
    <div>
      <AdminNaviBar selectedPage="Add Table Details" />
      <Sidebar />  
      <div className="container mx-auto p-10 bg-custom-toolight h-screen">
        <h1 className="text-2xl font-bold mb-6 text-black">Leave Requests for Employee {employeeId}</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4">
          <select
            value={filter.leaveType}
            onChange={(e) => setFilter({ ...filter, leaveType: e.target.value })}
            className="border rounded p-2 mr-2"
          >
            <option value="">All Leave Types</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="border rounded p-2 mr-2"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="border rounded p-2 mr-2"
            placeholder="End Date"
          />

          <input
            type="text"
            value={filter.leaveId}
            onChange={(e) => setFilter({ ...filter, leaveId: e.target.value })}
            className="border rounded p-2 mr-2"
            placeholder="Leave ID"
          />

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border rounded p-2"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <table className="min-w-full bg-white rounded-lg shadow-xl">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Leave ID</th>
              <th className="px-4 py-2 border">Leave Type</th>
              <th className="px-4 py-2 border">Start Date</th>
              <th className="px-4 py-2 border">End Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave) => (
              <tr key={leave._id} className="border-t">
                <td className="px-4 py-2">{leave._id}</td>
                <td className="px-4 py-2">{leave.leaveType}</td>
                <td className="px-4 py-2">{new Date(leave.leaveStartDate).toLocaleDateString()}</td> {/* Updated for Start Date */}
                <td className="px-4 py-2">{new Date(leave.leaveEndDate).toLocaleDateString()}</td> {/* Updated for End Date */}
                <td className="px-4 py-2">{leave.status}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    {leave.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(leave._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(leave._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default LeaveList;
