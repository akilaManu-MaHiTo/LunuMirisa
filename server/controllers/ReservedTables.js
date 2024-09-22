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

// Route to get all reservations
router.get("/reservations", (req, res) => {
    ReservedTables.find()
        .then(reservations => res.json(reservations))
        .catch(err => res.status(500).json({ error: err.message }));
});
// Route to delete a reservation
router.delete("/reservations/:id", (req, res) => {
    ReservedTables.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Reservation deleted." }))
        .catch(err => res.status(500).json({ error: err.message }));
});
// Route to update a reservation
router.put("/reservations/:id", (req, res) => {
    ReservedTables.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedReservation => res.json(updatedReservation))
        .catch(err => res.status(500).json({ error: err.message }));
});
// Route to get a single reservation by ID
router.get("/reservations/:id", (req, res) => {
    ReservedTables.findById(req.params.id)
        .then(reservation => {
            if (reservation) {
                res.json(reservation);
            } else {
                res.status(404).json({ error: "Reservation not found." });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});


module.exports = router;

