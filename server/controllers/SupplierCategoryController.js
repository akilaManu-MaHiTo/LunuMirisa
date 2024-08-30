const express = require('express');
const router = express.Router();
const SupplierCategory = require('../models/SupplierCategory');




// Create a new supplier category
router.post("/AddSupplierCategory", async (req, res) => {
    try {
        const category = await SupplierCategory.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Get all supplier categories
router.get("/ShowSupplierCategory", async (req, res) => {
    try {
        const categories = await SupplierCategory.find({});
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Get a single supplier category by ID
router.get("/getSupplierCategory/:id", async (req, res) => {
    try {
        const category = await SupplierCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category Not Found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Update a supplier category by ID
router.put("/updateSupplierCategory/:id", async (req, res) => {
    try {
        const category = await SupplierCategory.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, description: req.body.description },
            { new: true }
        );
        if (!category) return res.status(404).json({ error: 'Category Not Found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

// Delete a supplier category by ID
router.delete("/DeleteSupplierCategory/:id", async (req, res) => {
    try {
        const result = await SupplierCategory.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Category Not Found' });
        res.json({ message: 'Category Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

module.exports = router;
