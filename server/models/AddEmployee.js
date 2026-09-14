const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

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
    password: String
});

// Hash password before save - OWASP A07 fix
AddEmployeeSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    // Avoid double-hashing if already a bcrypt hash
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) return next();
    try {
        const saltRounds = Number(process.env.SALT) || 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

// Create the Employee model
const AddEmployeeModel = mongoose.model("addemployees", AddEmployeeSchema);

module.exports = AddEmployeeModel;
