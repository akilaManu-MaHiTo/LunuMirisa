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

router.get("/showMenu/:id",(req,res) => {

    const MenuId = req.params.id;
    Menu.findById({_id:MenuId })
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

router.put("/updateMenu/:id", (req, res) => {
    const menuId = req.params.id;
    Menu.findByIdAndUpdate(menuId, req.body, { new: true })
        .then(updatedMenuItem => res.json(updatedMenuItem))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
