const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

router.post("/createAddMenuList", (req, res) => {
    Menu.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

router.get("/ShowMenuList",(req,res) => {

    Menu.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))

});

module.exports = router;