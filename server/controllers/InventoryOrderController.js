const express = require('express');
const router = express.Router();
const InventoryOrder = require('../models/InventoryOrder');

router.post("/PlaceOrder", (req, res) => {
    InventoryOrder.create(req.body)
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
});

// Fetch an order by ID
router.get('/order/:id', (req, res) => {
    const { id } = req.params;
    InventoryOrder.findById(id)
        .then(order => {
            if (order) {
                res.json(order);
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        })
        .catch(err => res.status(500).json({ error: 'Failed to fetch order', details: err.message }));
});


// Fetch only orders that are still pending based on supplier's category
router.get('/orders/:category', (req, res) => {
    const { category } = req.params;

    InventoryOrder.find({ category: category, status: 'pending' })
        .then(orders => res.json(orders))
        .catch(err => res.status(500).json({ error: 'Failed to fetch orders' }));
});

// Update the order quantity
router.put('/UpdateOrderInventory/:orderId', async (req, res) => {
    const orderId = req.params.orderId; // Get the orderId from the request params
    const { orderQuantity } = req.body; // Get the quantity from the request body

    try {
        // Find the InventoryOrder by orderId and update the orderQuantity
        const updatedOrder = await InventoryOrder.findByIdAndUpdate(
            orderId, 
            { orderQuantity: orderQuantity }, // Update only the quantity field
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

  

// router.post('/acceptOrder/:id', (req, res) => {
//     const { id } = req.params;
//     const supplierId = req.body.supplierId;

//     InventoryOrder.findByIdAndUpdate(
//         id,
//         {
//             status: 'accepted',
//             supplierId: supplierId
//         },
//         { new: true } // Return the updated document
//     )
//     .then(updatedOrder => {
//         if (updatedOrder) {
//             res.json({ message: 'Order accepted successfully', order: updatedOrder });
//         } else {
//             res.status(404).json({ error: 'Order not found' });
//         }
//     })
//     .catch(err => res.status(500).json({ error: 'Failed to accept order', details: err.message }));
// });


// Backend route to fetch accepted orders for a specific supplier
router.get('/acceptedOrders/:supplierId', async (req, res) => {
    try {
      const { supplierId } = req.params;
      const acceptedOrders = await InventoryOrder.find({ supplierId, status: 'accepted' });
      res.json(acceptedOrders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch accepted orders' });
    }
  });
  

// Decline an order
router.post('/declineOrder/:id', (req, res) => {
    const { id } = req.params;

    // No need to delete or change the order status; the frontend will just filter it out for the current supplier
    res.json({ message: 'Order declined successfully' });
});

module.exports = router;
