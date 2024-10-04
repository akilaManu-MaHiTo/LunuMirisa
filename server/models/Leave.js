const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const LeaveSchema = new mongoose.Schema({
    leaveID: {
        type: String,
        default: uuidv4, // Automatically generates a unique ID
    },
    employeeID: {
        type: String,
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
    },
    leaveStartDate: {
        type: Date,
        required: true,
    },
    leaveEndDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending', // Default status is pending
    },
});

const LeaveModel = mongoose.model('leaves', LeaveSchema);

module.exports = LeaveModel;
