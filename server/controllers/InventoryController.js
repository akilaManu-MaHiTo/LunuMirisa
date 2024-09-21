const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const multer = require('multer');
const path = require('path');

// Setting up storage for the uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

// Route to handle adding an inventory item with an image
router.post("/AddInventory", upload.single('image'), (req, res) => {
    const { name, quantity, maxQuantity, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const newItem = new Inventory({
        name,
        image,
        quantity,
        maxQuantity,
        category
    });

    newItem.save()
        .then(item => res.json(item))
        .catch(err => res.status(500).json(err));
});

// Route to show inventory items
router.get("/ShowInventory", (req, res) => {
    Inventory.find({})
        .then(items => res.json(items))
        .catch(err => res.status(500).json(err));
});

// Route to get an inventory item by ID
router.get("/GetInventory/:id", (req, res) => {
    const { id } = req.params;

    Inventory.findById(id)
        .then(item => {
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            res.json(item);
        })
        .catch(err => res.status(500).json(err));
});

router.put("/updateInventory/:id", (req, res) => {
    const Id = req.params.id;
    const { newTotal } = req.body; // Get the new total quantity from the request body

    // Update only the quantity field
    Inventory.findByIdAndUpdate(
        { _id: Id },
        { $set: { quantity: newTotal } }, // Use $set to update only the quantity
        { new: true } // Return the updated document
    )
    .then(items => res.json(items))
    .catch(err => res.json(err));
});


module.exports = router;
