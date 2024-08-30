const express = require('express');
const router = express.Router();
const SupplierProfile = require('../models/SupplierProfile');

// Create a new supplier profile
router.post("/AddSupplier", async (req, res) => {
    try {
        const { name, address, contact, email, category } = req.body;
        const newSupplier = new SupplierProfile({
            name,
            address,
            contact,
            email,
            category
        });
        const savedSupplier = await newSupplier.save();
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

module.exports = router;
