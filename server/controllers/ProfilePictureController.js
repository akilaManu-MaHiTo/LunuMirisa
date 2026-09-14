const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// OWASP A04/A08 fix: restrict uploads to images only with size limits and safe filenames
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

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
        // Use crypto random + timestamp to avoid collisions and path traversal
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

const upload = multer({
    storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter,
});

// POST or PUT route for uploading or updating profile image
router.post("/ProfileImage", (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'Image too large (max 2MB)' });
            }
            return res.status(400).json({ msg: err.message });
        }
        next();
    });
}, async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ msg: 'userId is required' });
    }
    if (!req.file) {
        return res.status(400).json({ msg: 'Image file is required (jpg, jpeg, png, webp, max 2MB)' });
    }
    const image = req.file.filename;

    try {
        let profile = await Profile.findOne({ userId });
        if (profile) {
            profile.image = image;
            await profile.save();
            res.json({ msg: "Profile updated", profile });
        } else {
            profile = new Profile({ userId, image });
            await profile.save();
            res.json({ msg: "Profile created", profile });
        }
    } catch (err) {
        res.status(500).json({ msg: "There was an error", err: err.message });
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
