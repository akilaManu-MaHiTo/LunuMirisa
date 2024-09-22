const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/Users');

router.get("/getUser/:id",(req,res) => {

    const userId = req.params.id;
    UserModel.findById({_id: userId})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

router.put("/updateUser/:id",(req,res) => {
    

    const userId = req.params.id;
    UserModel.findByIdAndUpdate({_id: userId}, {name: req.body.name, email: req.body.email, age: req.body.age})
    .then(users => res.json(users))
    .catch(err => res.json(err))

})

router.delete("/deleteUser/:id",(req,res) => {

    const userId = req.params.id;
    UserModel.findByIdAndDelete({_id: userId})
    .then(users => res.json(users))
    .catch(err => res.json(err))

})

router.get("/countUsers", (req, res) => {
    UserModel.countDocuments({})
        .then(count => res.json({ count }))
        .catch(err => res.json(err));
});

module.exports = router;
