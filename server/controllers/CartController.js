const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Add item to cart
router.post("/Addtocarts", async (req, res) => {
    const { userId, itemId, category, type, price, cartDate } = req.body;

    // Validate input
    if (!userId || !itemId || !category || !type || !price) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Create a new cart item with cartDate
        const cartItem = await Cart.create({ userId, itemId, category, type, price, cartDate });

        res.status(201).json({
            message: "Item added to cart successfully.",
            cartItem
        });
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ message: "An error occurred while adding the item to the cart." });
    }
});


// Show cart items
router.get("/ShowCart/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find cart items where the userId matches the provided userId
        const cartItems = await Cart.find({ userId });

        res.json(cartItems);
    } catch (err) {
        console.error('Error finding cart items:', err);
        res.status(500).json({ message: "An error occurred while fetching cart items." });
    }
});

// Get item counts for all users
router.get("/itemCounts", async (req, res) => {
    try {
        // Aggregate to get counts of cart items per user
        const counts = await Cart.aggregate([
            {
                $group: {
                    _id: "$userId",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format the response
        const result = counts.map(item => ({
            userId: item._id,
            items: item.count
        }));

        res.json(result);
    } catch (err) {
        console.error('Error fetching item counts:', err);
        res.status(500).json({ message: "An error occurred while fetching item counts." });
    }
});

// Calculate total price for each day
router.get("/totalPriceByDay", async (req, res) => {
    try {
        // Aggregate to get total price for items grouped by day
        const totals = await Cart.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$cartDate" },
                        month: { $month: "$cartDate" },
                        day: { $dayOfMonth: "$cartDate" }
                    },
                    totalPrice: { $sum: { $toDouble: "$price" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $dateFromParts: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                    day: "$_id.day"
                                }
                            }
                        }
                    },
                    totalPrice: 1
                }
            },
            { $sort: { date: 1 } } // Optional: Sort by date
        ]);

        res.json(totals);
    } catch (err) {
        console.error('Error calculating total price by day:', err);
        res.status(500).json({ message: "An error occurred while calculating the total price by day." });
    }
});

// Get top three item IDs by highest price
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
