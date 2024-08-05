const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

router.post("/AddInventory", (req, res) => {
    Inventory.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

router.get("/ShowInventory",(req,res) => {

    Inventory.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))

});

module.exports = router;