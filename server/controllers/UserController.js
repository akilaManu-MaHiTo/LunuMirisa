const express = require('express');
const router = express.Router();
const User = require('../models/Users');

router.post("/createUserb", (req, res) => {
    User.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

router.get("/",(req,res) => {

    User.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))

})

router.get("/getUser/:id",(req,res) => {

    const userId = req.params.id;
    User.findById({_id: userId})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

router.put("/updateUser/:id",(req,res) => {
    

    const userId = req.params.id;
    User.findByIdAndUpdate({_id: userId}, {name: req.body.name, email: req.body.email, age: req.body.age})
    .then(users => res.json(users))
    .catch(err => res.json(err))

})

router.delete("/deleteUser/:id",(req,res) => {

    const userId = req.params.id;
    User.findByIdAndDelete({_id: userId})
    .then(users => res.json(users))
    .catch(err => res.json(err))

})
module.exports = router;
