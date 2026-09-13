const express = require('express');
const { UserModel } = require('../models/Users'); // Adjust the path to your User model
const router = express.Router();
const AddEmployee = require('../models/AddEmployee'); // Adjust the path to AddEmployee model
const { SupplierProfile } = require("../models/SupplierProfile"); // Adjust path to SupplierProfile model
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

router.post('/google-login', async (req, res) => {
  const { credential } = req.body;

  if (!credential || !process.env.GOOGLE_CLIENT_ID) {
    return res.status(400).json({ message: 'Google sign-in is not configured' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: 'Google account email is not verified' });
    }

    let user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      const password = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      user = await UserModel.create({
        firstName: payload.given_name || payload.name?.split(' ')[0] || 'Google',
        lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || 'User',
        email: payload.email,
        password,
        verified: true,
      });
    } else if (!user.verified) {
      user.verified = true;
      await user.save();
    }

    return res.status(200).json({
      message: 'Google login successful',
      token: user.generateAuthToken(),
      userId: user._id,
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    return res.status(401).json({ message: 'Invalid Google credential' });
  }
});

module.exports = router;
