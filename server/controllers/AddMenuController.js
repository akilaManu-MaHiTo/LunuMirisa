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

router.post("/createAddMenuList", upload.single('image'), async (req, res) => {
    const { title, price, category, description } = req.body;
    const image = req.file ? req.file.filename : null; // Get the image filename

    try {
        // Check if a menu item with the same title already exists
        const existingMenuItem = await Menu.findOne({ title: { title } });
        
        if (existingMenuItem) {
            return res.status(400).json({ message: "Item with this title already exists." });
        }

        // If not, create the new menu item
        const menuItem = await Menu.create({ title, price, image, category, description });
        return res.json(menuItem);
    } catch (err) {
        return res.status(500).json(err);
    }
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
    const { percentage } = req.body;

    Menu.findById(menuId)
        .then(item => {
            const newHotDealsStatus = item.hotDeals === "Yes" ? "No" : "Yes";
            return Menu.findByIdAndUpdate(menuId, { hotDeals: newHotDealsStatus, percentage }, { new: true });
        })
        .then(updatedMenuItem => res.json(updatedMenuItem))
        .catch(err => res.status(500).json(err));
});


router.get("/getHotDeals", (req, res) => {
    Menu.find({ hotDeals: "Yes" }) // Find all items where hotDeals is "Yes"
        .then(hotDealsItems => res.json(hotDealsItems))
        .catch(err => res.status(500).json(err));
});

router.get('/countAllmenulist', async (req, res) => {
    try {
        const userCount = await Menu.countDocuments(); // Count all documents in the User collection
        res.status(200).json({ count: userCount });
    } catch (err) {
        res.status(500).json({ error: 'Failed to count users' });
    }
});

router.get("/getHotDealsCount", (req, res) => {
    Menu.countDocuments({ hotDeals: "Yes" }) // Count all items where hotDeals is "Yes"
        .then(count => res.json({ count })) // Send the count as a JSON response
        .catch(err => res.status(500).json(err));
});





module.exports = router;
