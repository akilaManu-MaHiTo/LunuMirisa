const express = require('express');
const router = express.Router();
const ReservedTables = require('../models/Reserved'); // Adjust the path as needed

// Route to check if a table is already reserved
router.post("/checkReservation", (req, res) => {
    const { date, time, tableNum } = req.body;

    ReservedTables.findOne({ date, time, tableNum })
        .then(reservation => {
            if (reservation) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Route to create a new reservation
router.post("/reservedtables", (req, res) => {
    const { quantity, price, tableNum, date, time, userId } = req.body;

    // Create the reserved table
    ReservedTables.create({ quantity, price, tableNum, date, time, userId })
        .then(reservedTable => res.json(reservedTable))
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;

