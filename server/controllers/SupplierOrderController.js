const express = require('express');
const router = express.Router();
const SupplierOrder = require('../models/SupplierOrder');




router.post("/AddSupplierOrder", (req, res) => {
  SupplierOrder.create(req.body)
      .then(order => res.status(201).json(order))
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error', details: err.message });
      });
});


// Get accepted orders for a supplier
router.get('/acceptedOrders/:supplierId', (req, res) => {
    SupplierOrder.find({ supplierId: req.params.supplierId })
      .then(orders => res.json(orders))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
      });
  });

  // Get all accepted orders
router.get('/acceptedOrders', (req, res) => {
  SupplierOrder.find({})
    .then(orders => res.json(orders))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
});


// Delete an accepted order
router.delete('/acceptedOrders/:id', (req, res) => {
  SupplierOrder.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).send()) // Send a no-content response
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
});

// Update an accepted order
router.put('/acceptedOrders/:id', (req, res) => {
  SupplierOrder.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(order => res.json(order))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
});

router.put('/OrdersToNo/:id', (req, res) => {
  // Ensure the status is set to "No" during the update
  SupplierOrder.findByIdAndUpdate(
    req.params.id, 
    { status: 'No' }, // Explicitly setting the status to "No"
    { new: true }
  )
  .then(order => res.json(order))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });
});

router.get('/countYesSupply', async (req, res) => {
  try {
    const count = await SupplierOrder.countDocuments({ status: 'Yes' });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).json({ error: 'Error fetching count' });
  }
});


router.get('/countByCategory/:category', async (req, res) => {
  const { category } = req.params; // Get the category from the URL parameters
  try {
    // Group by category and count documents where orderQuantity is not equal to 0
    const counts = await SupplierOrder.aggregate([
      {
        $match: {
          category, // Match the category from request parameters
          orderQuantity: { $ne: 0 }  // Filter documents with orderQuantity not equal to 0
        }
      },
      {
        $group: {
          _id: "$category",  // Group by category
          count: { $sum: 1 } // Count the number of documents in each category
        }
      }
    ]);

    res.status(200).json(counts); // Respond with the counts grouped by category
  } catch (error) {
    console.error('Error fetching count by category:', error);
    res.status(500).json({ error: 'Error fetching count' });
  }
});




router.get('/calculateByNo', async (req, res) => {
  try {
    // Perform aggregation to sum up totalAmount for documents with status "No"
    const result = await SupplierOrder.aggregate([
      { $match: { status: "No" } }, // Filter documents with status "No"
      { $group: { _id: null, totalPrice: { $sum: "$totalAmount" } } } // Sum totalAmount
    ]);

    // Extract totalPrice from the aggregation result
    const totalPrice = result.length > 0 ? result[0].totalPrice : 0;

    // Send the total price in the response
    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error("Error calculating total price: ", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;
