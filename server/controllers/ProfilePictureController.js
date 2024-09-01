const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

// POST or PUT route for uploading or updating profile image
router.post("/ProfileImage", upload.single('image'), async (req, res) => {
    const { userId } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        let profile = await Profile.findOne({ userId });
        if (profile) {
            profile.image = image || profile.image;
            await profile.save();
            res.json({ msg: "Profile updated", profile });
        } else {
            profile = new Profile({ userId, image });
            await profile.save();
            res.json({ msg: "Profile created", profile });
        }
    } catch (err) {
        res.status(500).json({ msg: "There was an error", err });
    }
});

// GET route for fetching profile picture by userId
router.get("/ShowProfilePic/:userId", (req, res) => {
    const { userId } = req.params;
    
    Profile.findOne({ userId: userId })
        .then(item => {
            if (!item) {
                return res.status(404).json({ msg: "Profile not found" });
            }
            res.json(item);
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;
