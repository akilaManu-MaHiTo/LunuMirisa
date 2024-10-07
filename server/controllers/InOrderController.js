const express = require('express');
const router = express.Router();
const InOrder = require('../models/InOrder');

router.post("/InOrderCreate", (req, res) => {
    InOrder.create(req.body)
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
});

router.get("/ShowMyOrders/:userId", (req, res) => {
    const userId = req.params.userId;

    InOrder.distinct("date", { userId })
        .then(dates => res.json(dates))
        .catch(err => res.status(500).json(err));
});

router.get('/orders/:userId/:date', (req, res) => {
    const userId = req.params.userId;
    const date = req.params.date;
      
    InOrder.find({
        userId,
        date: { $regex: new RegExp(`^${date}`) } // Convert the date string to a Date object
    })
    .then(orders => res.json(orders))
    .catch(err => res.status(500).json(err));
});

// Get order items by orderId
router.get('/OrderItems/:orderId', (req, res) => {
    const { orderId } = req.params;

    InOrder.find({ orderId })
        .then(items => res.json(items))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.put('/UpdateStatus/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body; // Assume the new status is sent in the request body

    console.log(orderId, status);

    // Update the 'ongoing' field for all documents with the specified orderId
    InOrder.updateMany({ orderId }, { $set: { ongoing: status } })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.delete('/DeleteOrderItem/:itemId', (req, res) => {
    const { itemId } = req.params; // Retrieve itemId from request params

    // Find the order item by itemId and delete it
    InOrder.findByIdAndDelete(itemId)
        .then((result) => {
            if (result) {
                res.json({ message: 'Order item deleted successfully' });
            } else {
                res.status(404).json({ error: 'Order item not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

router.put('/UpdateQuentity/:itemId', (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    InOrder.updateOne({ _id: itemId }, { $set: { quantity: quantity } })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/calculateByDateAndTable', async (req, res) => {
    try {
        // Fetch the total amounts grouped by orderId
        const results = await InOrder.aggregate([
            {
                $group: {
                    _id: "$orderId",   // Grouping by orderId
                    totalAmount: { $sum: "$totalPrice" },  // Summing 'totalPrice'
                    userId: { $first: "$userId" },  // Get first 'userId' in each group
                    tableNum: { $first: "$tableNum" },  // Get first 'tableNum' in each group
                    firstDate: { $first: "$date" }  // Get the first 'date' in each group
                }
            },
            {
                $project: {
                    _id: 0,  // Exclude the _id field from the output
                    orderId: "$_id",  // Project orderId from the grouped _id
                    userId: 1,  // Include userId
                    tableNum: 1,  // Include tableNum
                    totalAmount: 1,  // Include totalAmount
                    date: "$firstDate"  // Project the first date in each group
                }
            }
        ]);

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/calculateAllTotal', async (req, res) => {
    try {
        // Get all orders from the database
        const orders = await InOrder.find({});

        // Calculate total price across all orders, handling potential null values
        const totalPrice = orders.reduce((acc, order) => {
            // Ensure totalPrice is a number before adding
            return acc + (order.totalPrice || 0); 
        }, 0);

        res.status(200).json({
            message: 'Total price calculated successfully',
            totalPrice: totalPrice
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error calculating total price',
            error: error.message
        });
    }
});



module.exports = router;