const express = require('express');
const router = express.Router();
const CartForm = require('../models/CartForm');

// POST route to handle form submission
router.post("/addCartInfo", (req, res) => {
    CartForm.create(req.body)
        .then(cartForm => res.json(cartForm))
        .catch(err => res.status(500).json(err));
});

// GET route to retrieve all cart information
router.get("/getCartInfo", (req, res) => {
    CartForm.find()
        .then(cartForms => res.json(cartForms))
        .catch(err => res.status(500).json(err));
});

// DELETE route to remove an order
router.delete("/deleteOrder/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await CartForm.findByIdAndDelete(id); // Changed from Cart to CartForm
        if (!result) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json({ message: "Order deleted successfully." });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: "An error occurred while deleting the order." });
    }
});


module.exports = router;
