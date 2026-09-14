const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_SIZE = 2 * 1024 * 1024;

const uploadDir = path.join(__dirname, '..', 'public', 'Images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
        const safeName = `${file.fieldname}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${safeExt}`;
        cb(null, safeName);
    }
});

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
        return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
    }
    cb(null, true);
}

const upload = multer({ storage, limits: { fileSize: MAX_SIZE }, fileFilter });

router.post("/createAddMenuList", (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'Image too large (max 2MB)' });
            }
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    const { title, price, category, description } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required (jpg, jpeg, png, webp, max 2MB)' });
    }
    const image = req.file.filename;

    try {
        const existingMenuItem = await Menu.findOne({ title });
        if (existingMenuItem) {
            return res.status(400).json({ message: "Item with this title already exists." });
        }
        const menuItem = await Menu.create({ title, price, image, category, description });
        return res.json(menuItem);
    } catch (err) {
        console.error("Error creating menu item:", err.message);
        return res.status(500).json({ message: "Server error while creating menu item" });
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
