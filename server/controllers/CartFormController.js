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

router.get('/getCalculationByDay', async (req, res) => {
    try {
        // Aggregation pipeline to group and sum totalPrice by createdAt date
        const totalsByDay = await CartForm.aggregate([
            {
                // Grouping stage
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } // Format the date to YYYY-MM-DD
                    },
                    total: { $sum: { $toDouble: "$totalPrice" } } // Sum the totalPrice after converting to double
                }
            },
            {
                // Projecting stage to format the output
                $project: {
                    date: "$_id", // Rename _id to date
                    total: 1, // Include total
                    _id: 0 // Exclude the _id field from the output
                }
            },
            {
                // Optional sorting stage to sort by date
                $sort: { date: 1 }
            }
        ]);

        res.json(totalsByDay); // Send the result as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); // Handle errors
    }
});

router.get('/paymentGetByUserId/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find payments for the given userId
        const payments = await CartForm.find({ userId });

        if (payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this user.' });
        }

        res.status(200).json(payments);
        console.log(payments)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
