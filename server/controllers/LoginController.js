const express = require('express');
const { UserModel } = require('../models/Users'); // Adjust the path to your User model
const router = express.Router();
const AddEmployee = require('../models/AddEmployee'); // Adjust the path to AddEmployee model
const { SupplierProfile } = require("../models/SupplierProfile"); // Adjust path to SupplierProfile model
const bcrypt = require("bcryptjs");
require('dotenv').config();

router.post('/loginUser', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  try {
    // Check if AddEmployee exists using EmployeeEmail
    const addEmployee = await AddEmployee.findOne({ EmployeeEmail: email });
    if (addEmployee) {
      console.log('AddEmployee found:', addEmployee);

      // Direct string comparison for AddEmployee
      if (addEmployee.password === password) {
        const statusCode = {
          'Manager': 201,
          'Waiter': 202,
          'Chef': 203
        }[addEmployee.EmployeePosition] || 204;

        console.log('AddEmployee login successful:', addEmployee);
        return res.status(statusCode).json({ message: 'Login successful', user: addEmployee, userId: addEmployee._id });
      } else {
        console.log('Invalid credentials for AddEmployee');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (user) {
      console.log('User found:', user);

      // Use bcrypt to compare the password for users
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        if (user.verified === true) {
          console.log('User login successful:', user);
          return res.status(200).json({ message: 'Login successful', user, userId: user._id });
        } else {
          console.log('User not verified:', user);
          return res.status(505).json({ message: 'User not verified' });
        }
      } else {
        console.log('Invalid credentials for user');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // Check if supplier exists
    const supplier = await SupplierProfile.findOne({ email });
    if (supplier) {
      console.log('Supplier found:', supplier);

      // Use bcrypt to compare the password for suppliers
      const isMatch = await bcrypt.compare(password, supplier.password);
      if (isMatch) {
        console.log('Supplier ID:', supplier._id); // Debugging log

        return res.status(206).json({ message: 'Login successful', user: supplier, SupplierId: supplier._id });
      } else {
        console.log('Invalid credentials for supplier');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // If no user, addEmployee, or supplier found
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
