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

// Get top three items by highest price
router.get("/topThreeItemIds", async (req, res) => {
    try {
        // Aggregate to get top three item IDs by highest price
        const topItems = await Cart.aggregate([
            {
                $group: {
                    _id: "$itemId",
                    maxPrice: { $max: { $toDouble: "$price" } },
                    type: { $first: "$type" }, // Capture the type
                    category: { $first: "$category" } // Capture the category
                }
            },
            { $sort: { maxPrice: -1 } }, // Sort by price in descending order
            { $limit: 3 }, // Limit to top 3 items
            { 
                $project: { 
                    _id: 0, 
                    itemId: "$_id", 
                    maxPrice: 1, 
                    type: 1, 
                    category: 1 // Include type and category in the output
                } 
            }
        ]);

        res.json(topItems);
    } catch (err) {
        console.error('Error fetching top three item IDs:', err);
        res.status(500).json({ message: "An error occurred while fetching the top three item IDs." });
    }
});



module.exports = router;
