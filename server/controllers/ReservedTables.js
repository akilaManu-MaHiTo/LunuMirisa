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
    const { quantity, price, tableNum, date, time, userId,email } = req.body;

    // Create the reserved table
    ReservedTables.create({ quantity, price, tableNum, date, time, userId,email })
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

router.get('/getReservationByUserId/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
      // Fetch reservations by userId
      const reservations = await ReservedTables.find({ userId });
      
      if (!reservations || reservations.length === 0) {
        return res.status(404).json({ message: 'No reservations found for this user.' });
      }
  
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching reservation details:", error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.put("/updateReservedTable/:reserveId", async (req, res) => {
    const { date, time, tableNum } = req.body; // Ensure tableNum is included
    const { reserveId } = req.params;

    try {
        // Check if the new date and time for the table already exist
        const existingReservation = await ReservedTables.findOne({
            date,
            time,
            tableNum,
            _id: { $ne: reserveId } // Exclude the current reservation being updated
        });

        // Log existing reservations for debugging
        console.log('Existing Reservation:', existingReservation);

        // If a reservation exists, prevent the update
        if (existingReservation) {
            return res.status(400).json({ message: "This table is already reserved for the selected date and time." });
        }

        // Proceed with updating the reservation
        const updatedReservation = await ReservedTables.findByIdAndUpdate(reserveId, req.body, { new: true });
        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found." });
        }

        // Return the updated reservation
        res.json(updatedReservation);
    } catch (err) {
        console.error("Error updating reservation:", err); // Log the error for debugging
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;

