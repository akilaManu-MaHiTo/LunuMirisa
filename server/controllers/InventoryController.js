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

// Route to update the inventory quantity with a new total quantity
router.put("/updateInventory/:id", (req, res) => {
    const Id = req.params.id;
    const { newTotal } = req.body; // Get the new total quantity from the request body

    // Update only the quantity field
    Inventory.findByIdAndUpdate(
        { _id: Id },
        { $set: { quantity: newTotal } }, // Use $set to update only the quantity
        { new: true } // Return the updated document
    )
    .then(item => res.json(item))
    .catch(err => res.status(500).json(err));
});

// Route to delete an inventory item
router.delete("/DeleteInventoryItem/:id", (req, res) => {
    const { id } = req.params;

    Inventory.findByIdAndDelete(id)
        .then(item => {
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            res.json({ message: "Item successfully deleted", item });
        })
        .catch(err => res.status(500).json({ message: "Error deleting item", error: err }));
});
// Route to update inventory by adding orderQuantity to the current quantity
router.put("/updateBySupply/:name", (req, res) => {
    const { name } = req.params;
    const { orderQuantity } = req.body; // Get orderQuantity from the request body

    // Find the inventory item by name and update the quantity
    Inventory.findOne({ name })
        .then(item => {
            if (!item) {
                return res.status(404).json({ message: "Inventory item not found" });
            }

            // Add orderQuantity to the existing quantity
            item.quantity += orderQuantity;

            // Save the updated item
            item.save()
                .then(updatedItem => res.json(updatedItem))
                .catch(err => res.status(500).json({ message: "Error updating inventory", error: err }));
        })
        .catch(err => res.status(500).json({ message: "Error fetching inventory item", error: err }));
});


module.exports = router;
