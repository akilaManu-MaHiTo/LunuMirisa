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





module.exports = router;
