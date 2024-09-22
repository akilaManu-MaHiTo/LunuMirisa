const express = require('express');
const router = express.Router();
const InOrderTable = require('../models/InOrderTable');

// POST request to create an order table
router.post("/createOrderTable", (req, res) => {
    const { tableNum } = req.body; // Destructure the required fields from the request body

    // Validate input: check if tableNum is provided
    if (!tableNum) {
        return res.status(400).json({ error: "Table number is required" });
    }

    // Create the new order table record
    InOrderTable.create({ tableNum })
        .then(order => {
            res.status(201).json({
                message: "Order table created successfully",
                order: {
                    id: order._id,       // Return the created order's ID
                    tableNum: order.tableNum, // Return the table number
                    OrderTime: order.date,
                    ongoing: order.status
                }
            });
        })
        .catch(err => {
            console.error("Error creating order table:", err);
            res.status(500).json({ error: "Failed to create order table" });
        });
});

module.exports = router;
