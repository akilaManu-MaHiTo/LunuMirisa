const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Add item to cart
router.post("/Addtocarts", async (req, res) => {
    const { userId, itemId, category, title, price } = req.body;

    // Validate input
    if (!userId || !itemId || !category || !price) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        
        const cartItem = await Cart.create({ userId, itemId, category, title, price });

        res.status(201).json({
            message: "Item added to cart successfully.",
            cartItem
        });
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ message: "An error occurred while adding the item to the cart." });
    }
});


router.get("/ShowCart/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        
        const cartItems = await Cart.find({ userId });

        
        const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price),0);

    
        res.json({
            cartItems,
            totalPrice
        });

    } catch (err) {
        console.error('Error finding cart items:', err);
        res.status(500).json({ message: "An error occurred while fetching cart items." });
    }
});


router.delete("/RemoveFromCart/:itemId", async (req, res) => {
    const { itemId } = req.params;
    try {
        await Cart.findByIdAndDelete(itemId); 
        res.status(200).json({ message: "Item removed from cart successfully." });
    } catch (err) {
        console.error("Error removing item from cart:", err);
        res.status(500).json({ message: "An error occurred while removing the item from the cart." });
    }
});


router.get("/topThreeItemIds", async (req, res) => {
    try {
        
        const topItems = await Cart.aggregate([
            {
                $group: {
                    _id: "$itemId",
                    maxPrice: { $max: { $toDouble: "$price" } },
                    type: { $first: "$type" }, 
                    category: { $first: "$category" } 
                }
            },
            { $sort: { maxPrice: -1 } }, 
            { $limit: 3 }, 
            { 
                $project: { 
                    _id: 0, 
                    itemId: "$_id", 
                    maxPrice: 1, 
                    type: 1, 
                    category: 1 
                } 
            }
        ]);

        res.json(topItems);
    } catch (err) {
        console.error('Error fetching top three item IDs:', err);
        res.status(500).json({ message: "An error occurred while fetching the top three item IDs." });
    }
});

router.get("/countCartItems/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      
      const cartItemCount = await Cart.countDocuments({ userId });
   
      res.status(200).json({ count: cartItemCount });
    } catch (error) {
      console.error("Error fetching cart item count:", error);
      res.status(500).json({ message: 'Error fetching cart item count' });
    }
  });

  router.post("/Checkout/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
       
        const cartItems = await Cart.find({ userId });

       
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cannot checkout with an empty cart." });
        }

       

        res.status(200).json({ message: "Checkout successful!" });
    } catch (err) {
        console.error("Error during checkout:", err);
        res.status(500).json({ message: "An error occurred during checkout." });
    }
});

// Update item quantity in the cart
router.put("/UpdateCartItem/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
       
        const updatedCartItem = await Cart.findByIdAndUpdate(itemId, { quantity }, { new: true });
        
        if (!updatedCartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Item quantity updated successfully", updatedCartItem });
    } catch (err) {
        console.error("Error updating cart item quantity:", err);
        res.status(500).json({ message: "An error occurred while updating the cart item." });
    }
});

  
module.exports = router;
