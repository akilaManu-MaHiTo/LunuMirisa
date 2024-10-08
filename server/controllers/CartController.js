const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');


router.post("/Addtocarts", async (req, res) => {
    const { userId, itemId, category, title, price, image } = req.body;

    if (!userId || !itemId || !category || !price || !image) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if the item with the same userId and title already exists in the cart
        const existingCartItem = await Cart.findOne({ 
            userId: userId, 
            title: title 
        });

        if (existingCartItem) {
            return res.status(400).json({ message: "Item already exists in the cart." });
        }

        // If the item doesn't exist, add it to the cart
        const cartItem = await Cart.create({ userId, itemId, category, title, price, image });

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


router.delete("/RemoveFromCart/:itemtitle/:userId", async (req, res) => {
    const { itemtitle, userId } = req.params; 
    try {
        const result = await Cart.deleteMany({ title: itemtitle, userId: userId }); 
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Items removed from cart successfully." });
        } else {
            res.status(404).json({ message: "No items found with the specified title." });
        }
    } catch (err) {
        console.error("Error removing items from cart:", err);
        res.status(500).json({ message: "An error occurred while removing items from the cart." });
    }
});



router.get("/topThreeItemIds", async (req, res) => {
    try {
        const topItems = await Cart.aggregate([
            {
                $group: {
                    _id: "$itemId",  
                    totalQuantity: { $sum: "$quantity" },  
                    title: { $first: "$title" }, 
                    category: { $first: "$category" },
                    image: { $first: "$image" },
                    price: { $first: "$price" }
                }
            },
            { $sort: { totalQuantity: -1 } },  // Sort by totalQuantity in descending order
            { $limit: 3 },  // Limit to the top 3 items
            { 
                $project: { 
                    _id: 0,  
                    itemId: "$_id",  
                    totalQuantity: 1,  
                    title: 1, 
                    category: 1,
                    image: 1,
                    price: 1  
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
