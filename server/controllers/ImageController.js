const express = require('express');
const router = express.Router();
const Image = require('../models/Images');

router.post("/addImage", (req, res) => {
    Image.create(req.body)
        .then(images => res.json(images))
        .catch(err => res.status(500).json(err));
});

router.get("/showImages",(req,res) => {

    Image.find({})
    .then(images => res.json(images))
    .catch(err => res.json(err))

});

module.exports = router;