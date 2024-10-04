const express = require('express');
const router = express.Router();
const LeaveModel = require('../models/Leave'); 

// Route to apply for leave
router.post('/applyleave', async (req, res) => {
    try {
        const newLeaveRequest = new LeaveModel(req.body);
        const savedLeaveRequest = await newLeaveRequest.save();
        res.status(201).json(savedLeaveRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error applying for leave', error });
    }
});

// Get all leaves for an employee
router.get('/leaves/:employeeId', async (req, res) => {
    const { employeeId } = req.params;

    try {
        const leaves = await LeaveModel.find({ employeeID: employeeId });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaves', error });
    }
});

// Approve a leave request
router.put('/leaves/approve/:leaveId', async (req, res) => {
    const { leaveId } = req.params;

    try {
        const updatedLeave = await LeaveModel.findByIdAndUpdate(
            leaveId,
            { status: 'Approved' },
            { new: true }
        );
        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Error approving leave', error });
    }
});

// Reject a leave request
router.put('/leaves/reject/:leaveId', async (req, res) => {
    const { leaveId } = req.params;

    try {
        const updatedLeave = await LeaveModel.findByIdAndUpdate(
            leaveId,
            { status: 'Rejected' },
            { new: true }
        );
        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting leave', error });
    }
});

module.exports = router;
