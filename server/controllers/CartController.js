const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Add item to cart
router.post("/Addtocarts", async (req, res) => {
    const { userId, itemId, category, type, price } = req.body;

    // Validate input
    if (!userId || !itemId || !category || !type || !price) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Create a new cart item
        const cartItem = await Cart.create({ userId, itemId, category, type, price });

        res.status(201).json({
            message: "Item added to cart successfully.",
            cartItem
        });
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ message: "An error occurred while adding the item to the cart." });
    }
});

// Show cart items and calculate total price
router.get("/ShowCart/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        // Find cart items where the userId matches the provided userId
        const cartItems = await Cart.find({ userId });

        // Calculate the total price of all cart items
        const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price),0);

        // Send back cart items along with the total price
        res.json({
            cartItems,
            totalPrice
        });

    } catch (err) {
        console.error('Error finding cart items:', err);
        res.status(500).json({ message: "An error occurred while fetching cart items." });
    }
});

module.exports = router;
