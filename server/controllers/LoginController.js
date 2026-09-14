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

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if AddEmployee exists using EmployeeEmail
    const addEmployee = await AddEmployee.findOne({ EmployeeEmail: email });
    if (addEmployee) {
      let isMatch = false;
      const stored = addEmployee.password || '';
      const isHashed = stored.startsWith('$2a$') || stored.startsWith('$2b$');
      if (isHashed) {
        isMatch = await bcrypt.compare(password, stored);
      } else {
        // Legacy plaintext accounts: compare directly then migrate to hash
        isMatch = stored === password;
        if (isMatch) {
          const saltRounds = Number(process.env.SALT) || 10;
          addEmployee.password = await bcrypt.hash(password, saltRounds);
          await addEmployee.save();
        }
      }

      if (isMatch) {
        const statusCode = {
          'Manager': 201,
          'Waiter': 202,
          'Chef': 203
        }[addEmployee.EmployeePosition] || 204;

        // Return minimal safe payload without password hash
        const safeEmployee = addEmployee.toObject();
        delete safeEmployee.password;
        return res.status(statusCode).json({ message: 'Login successful', user: safeEmployee, userId: safeEmployee._id });
      } else {
        // Generic message to prevent user enumeration/timing oracle
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        if (user.verified === true) {
          const safeUser = user.toObject();
          delete safeUser.password;
          return res.status(200).json({ message: 'Login successful', user: safeUser, userId: safeUser._id });
        } else {
          // Do not reveal 'not verified' distinctly via different status; use 401 with generic message
          return res.status(401).json({ message: 'Account not verified. Please verify your email.' });
        }
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Check if supplier exists
    const supplier = await SupplierProfile.findOne({ email });
    if (supplier) {
      const isMatch = await bcrypt.compare(password, supplier.password);
      if (isMatch) {
        const safeSupplier = supplier.toObject();
        delete safeSupplier.password;
        return res.status(206).json({ message: 'Login successful', user: safeSupplier, SupplierId: safeSupplier._id });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Generic not-found to prevent enumeration
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Error during login:', error.message);
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
