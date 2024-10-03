const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/createAddMenuList", upload.single('image'), (req, res) => {
    const { title, price, category } = req.body;
    const image = req.file ? req.file.filename : null; // Get the image filename

    Menu.create({ title, price, image, category })
        .then(menuItem => res.json(menuItem))
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
router.delete("/deleteMenuList/:id", (req, res) => {
    Menu.findByIdAndDelete(req.params.id)
        .then(result => res.json({ message: 'Menu item deleted successfully', result }))
        .catch(err => res.status(500).json(err));
});

router.put("/updateMenu/:id", (req, res) => {
    const menuId = req.params.id;
    Menu.findByIdAndUpdate(menuId, req.body, { new: true })
        .then(updatedMenuItem => res.json(updatedMenuItem))
        .catch(err => res.status(500).json(err));
});

router.put("/UpdateHotDeals/:id", (req, res) => {
    const menuId = req.params.id;

    Menu.findById(menuId)
        .then(item => {
            // Toggle the hotDeals value
            const newHotDealsStatus = item.hotDeals === "Yes" ? "No" : "Yes";
            return Menu.findByIdAndUpdate(menuId, { hotDeals: newHotDealsStatus }, { new: true });
        })
        .then(updatedMenuItem => res.json(updatedMenuItem))
        .catch(err => res.status(500).json(err));
});

router.get("/getHotDeals", (req, res) => {
    Menu.find({ hotDeals: "Yes" }) // Find all items where hotDeals is "Yes"
        .then(hotDealsItems => res.json(hotDealsItems))
        .catch(err => res.status(500).json(err));
});




module.exports = router;
