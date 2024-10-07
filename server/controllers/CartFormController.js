const express = require('express');
const router = express.Router();
const CartForm = require('../models/CartForm');


router.post("/addCartInfo", (req, res) => {
    CartForm.create(req.body)
        .then(cartForm => res.json(cartForm))
        .catch(err => res.status(500).json(err));
});


router.get("/getCartInfo", (req, res) => {
    CartForm.find()
        .then(cartForms => res.json(cartForms))
        .catch(err => res.status(500).json(err));
});


router.delete("/deleteOrder/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await CartForm.findByIdAndDelete(id); 
        if (!result) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json({ message: "Order deleted successfully." });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: "An error occurred while deleting the order." });
    }
});

router.get('/CalculateAll', async (req, res) => {
    try {
       
        const cartItems = await CartForm.find(); 

        const totalPrice = cartItems.reduce((acc, item) => {
            const price = parseFloat(item.totalPrice);
            return acc + (isNaN(price) ? 0 : price); 
        }, 0);

       
        res.status(200).json({ totalPrice });
    } catch (error) {
        console.error('Error calculating total price:', error); 
        res.status(500).json({ message: 'Error calculating total price', error: error.message });
    }
});


module.exports = router;
