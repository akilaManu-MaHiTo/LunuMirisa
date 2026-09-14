const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AddEmployeeModel = require('../models/AddEmployee'); 

// Route to add employee - password hashing handled by model pre-save hook
router.post('/addemployee', async (req, res) => {
    try {
        const newEmployee = new AddEmployeeModel(req.body);
        const savedEmployee = await newEmployee.save();
        const safe = savedEmployee.toObject();
        delete safe.password;
        res.status(201).json(safe);
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
});

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await AddEmployeeModel.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
});

// Get a single employee by ID
router.get('/employee/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const employee = await AddEmployeeModel.findById(userId);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
});


// Update an employee - handle password hashing on update (findByIdAndUpdate bypasses pre-save)
router.put('/employee/:id', async (req, res) => {
    try {
        const update = { ...req.body };
        if (update.password && !(update.password.startsWith('$2a$') || update.password.startsWith('$2b$'))) {
            const saltRounds = Number(process.env.SALT) || 10;
            update.password = await bcrypt.hash(update.password, saltRounds);
        }
        const updatedEmployee = await AddEmployeeModel.findByIdAndUpdate(
            req.params.id, 
            update, 
            { new: true }  // Return the updated document
        );
        if (updatedEmployee) {
            const safe = updatedEmployee.toObject();
            delete safe.password;
            res.status(200).json(safe);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

// Delete an employee
router.delete('/employee/:id', async (req, res) => {
    try {
        const deletedEmployee = await AddEmployeeModel.findByIdAndDelete(req.params.id);
        if (deletedEmployee) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});

module.exports = router;
