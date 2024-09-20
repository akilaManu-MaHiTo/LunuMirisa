const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AddEmployeeSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        default: uuidv4,  // Automatically generates a unique ID
    },
    EmployeeName: String,
    EmployeeEmail: String,
    EmployeeAge: Number,
    EmployeePosition: String,
    Salary: String,
    Contact: Number,
});

// Create the Employee model
const AddEmployeeModel = mongoose.model("addemployees", AddEmployeeSchema);

module.exports = AddEmployeeModel;
