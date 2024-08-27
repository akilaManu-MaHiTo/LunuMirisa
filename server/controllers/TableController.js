const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

router.post("/createTable", (req, res) => {
    Table.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

router.get("/ShowMenuList",(req,res) => {

    Menu.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))

});

module.exports = router;