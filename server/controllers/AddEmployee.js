const express = require('express');
const router = express.Router();
const AddEmployeeModel = require('../models/AddEmployee'); // Assuming your model is located here

// Route to add employee
router.post('/addemployee', async (req, res) => {
    try {
        const newEmployee = new AddEmployeeModel(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error });
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


// Update an employee
router.put('/employee/:id', async (req, res) => {
    try {
        const updatedEmployee = await AddEmployeeModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }  // Return the updated document
        );
        if (updatedEmployee) {
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
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
