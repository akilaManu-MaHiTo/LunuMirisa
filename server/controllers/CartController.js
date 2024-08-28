const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post("/Addtocarts", (req, res) => {
    Cart.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

router.get("/ShowMenuList",(req,res) => {

    Menu.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))

});

module.exports = router;