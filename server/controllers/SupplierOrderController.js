const express = require('express');
const router = express.Router();
const SupplierOrder = require('../models/SupplierOrder');

// Add a new supplier order
router.post("/AddSupplierOrder", (req, res) => {
    SupplierOrder.create(req.body)
        .then(order => res.status(201).json(order))
        .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

// Get all supplier orders
router.get("/ShowSupplierOrder", (req, res) => {
    SupplierOrder.find({})
        .then(orders => res.json(orders))
        .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

// Get a specific supplier order by ID
router.get("/getSupplierOrder/:id", (req, res) => {
    const orderId = req.params.id;
    SupplierOrder.findById(orderId)
        .then(order => {
            if (!order) return res.status(404).json({ error: 'Order Not Found' });
            res.json(order);
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

// Update a supplier order by ID
router.put("/updateSupplierOrder/:id", (req, res) => {
    const orderId = req.params.id;
    SupplierOrder.findByIdAndUpdate(
        orderId,
        {
            amount: req.body.amount,
            price: req.body.price,
            deliveryDate: req.body.deliveryDate,
            specialNote: req.body.specialNote
        },
        { new: true } // Return the updated document
    )
    .then(order => {
        if (!order) return res.status(404).json({ error: 'Order Not Found' });
        res.json(order);
    })
    .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

// Delete a supplier order by ID
router.delete("/deleteSupplierOrder/:id", (req, res) => {
    const orderId = req.params.id;
    SupplierOrder.findByIdAndDelete(orderId)
        .then(result => {
            if (!result) return res.status(404).json({ error: 'Order Not Found' });
            res.json({ message: 'Order Deleted Successfully' });
        })
        .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

module.exports = router;
