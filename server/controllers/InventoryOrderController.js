const express = require('express');
const router = express.Router();
const InOrders = require('../models/InventoryOrder');

router.post("/PlaceOrder", (req, res) => {
    InOrders.create(req.body)
        .then(images => res.json(images))
        .catch(err => res.status(500).json(err));
});


module.exports = router;