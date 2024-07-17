const express = require('express');
const User = require('../models/Users'); // Adjust the path to your User model
const router = express.Router();
const Employee = require('../models/Employees'); // Adjust the path to your Employee model

const app = express();

router.post('/loginUser', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  Employee.findOne({ email })
    .then(employee => {
      if (employee) {
        console.log('Employee found:', employee);
        if (employee.EmPassword === password) {
          
          if (employee.EmType === 'Manager') {

            console.log('Employee login successful:', employee);
            return res.status(201).json({ message: 'Login successful', user: employee });

          } else if (employee.EmType === 'Viator') {

            console.log('Employee login successful:', employee);
            return res.status(202).json({ message: 'Login successful', user: employee });

          } else if (employee.EmType === 'Cashier') {

            console.log('Employee login successful:', employee);
            return res.status(203).json({ message: 'Login successful', user: employee });

          } else {

            console.log('Employee login successful:', employee);
            return res.status(204).json({ message: 'Login successful', user: employee });

          }

        } else {
          console.log('Invalid credentials for employee');
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } else {
        User.findOne({ email })
          .then(user => {
            if (user) {
              console.log('User found:', user);
              if (user.password === password) {
                //req.session.userId = user._id; // Store user ID in session
                return res.status(200).json({ message: 'Login successful', user });
              } else {
                console.log('Invalid credentials for user');
                return res.status(400).json({ message: 'Invalid credentials' });
              }
            } else {
              console.log('User not found');
              return res.status(404).json({ message: 'User not found' });
            }
          })
          .catch(err => {
            console.error('Error finding user:', err);
            return res.status(500).json({ message: 'Server error', error: err });
          });
      }
    })
    .catch(err => {
      console.error('Error finding employee:', err);
      return res.status(500).json({ message: 'Server error', error: err });
    });
});

module.exports = router;
