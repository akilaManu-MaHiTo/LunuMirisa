const express = require('express');
const { UserModel } = require('../models/Users'); // Adjust the path to your User model
const router = express.Router();
const Employee = require('../models/Employees'); // Adjust the path to your Employee model
const bcrypt = require("bcrypt");
require('dotenv').config();

const app = express();

router.post('/loginUser', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  try {
    const employee = await Employee.findOne({ email });
    if (employee) {
      console.log('Employee found:', employee);

      // Direct string comparison for employees
      if (employee.EmPassword === password) {
        const statusCode = {
          'Manager': 201,
          'Waitor': 202,
          'Cashier': 203
        }[employee.EmType] || 204;

        console.log('Employee login successful:', employee);
        return res.status(statusCode).json({ message: 'Login successful', user: employee });
      } else {
        console.log('Invalid credentials for employee');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      const user = await UserModel.findOne({ email });
      if (user) {
        console.log('User found:', user);

        // Use bcrypt to compare the password for users
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          if (user.verified === true) {
            return res.status(200).json({ message: 'Login successful', user, userId: user._id });
          } else {
            return res.status(505).json({ message: 'User Not verified' });
          }
        } else {
          console.log('Invalid credentials for user');
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } else {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
    }
  } catch (err) {
    console.error('Error finding user or employee:', err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
