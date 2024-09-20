const express = require('express');
const router = express.Router();

const crypto = require("crypto");
const sendEmail = require("../util/Email");
require('dotenv').config();
const bcrypt = require("bcrypt");
const { SupplierProfile, validate } = require("../models/SupplierProfile");



router.post("/AddSupplier", async (req, res) => {
    try {
        

        let supplier = await SupplierProfile.findOne({ email: req.body.email });

        if (supplier) return res.status(409).send({ message: "supplier with given email already exists!" });
        const password = crypto.randomBytes(16).toString("hex");

         const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);

        const { name, address, contact, email, category } = req.body;
        const newSupplier = new SupplierProfile({
            name,
            address,
            contact,
            email,
            category,
            password:hashPassword
        });
        
        const url = `${process.env.BASE_URL}`;
        const savedSupplier = await newSupplier.save();
        await sendEmail(email, "Login Credentials" + "This is your password: "+password,url);
        res.status(201).json(savedSupplier);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});


// Retrieve all supplier profiles
router.get("/ShowSupplierProfiles", async (req, res) => {
    try {
        const suppliers = await SupplierProfile.find({});
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Retrieve a single supplier profile by ID
router.get("/ShowSupplierProfile/:id", async (req, res) => {
    try {
        const supplier = await SupplierProfile.findById(req.params.id);
        if (!supplier) return res.status(404).json({ error: 'Supplier Not Found' });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Update a supplier profile by ID
router.put("/UpdateSupplierProfile/:id", async (req, res) => {
    try {
        const { name, address, contact, email, category } = req.body;
        const updatedSupplier = await SupplierProfile.findByIdAndUpdate(
            req.params.id,
            { name, address, contact, email, category },
            { new: true }
        );
        if (!updatedSupplier) return res.status(404).json({ error: 'Supplier Not Found' });
        res.json(updatedSupplier);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Delete a supplier profile by ID
router.delete("/DeleteSupplierProfile/:id", async (req, res) => {
    try {
        const result = await SupplierProfile.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Supplier Not Found' });
        res.json({ message: 'Supplier Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

router.post("/SignInSupplier", async (req, res) => {
    const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  try {
    const supplier= await SupplierProfile.findOne({ email });
    if (supplier) {
        const isCorrect = await bcrypt.compare(password, supplier.password);
  
        // Direct string comparison for employees
        if (isCorrect) {
        return res.status(200).json({ message: 'Login successful', supplier: supplier,supplierId:supplier._id });

        }}

}catch{
    console.log("yyyyyyyy");

}
});





  

module.exports = router;