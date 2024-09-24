const { UserModel, validate } = require("../models/Users");
const router = require("express").Router();
const Token = require("../models/Token"); // Ensure correct path
const crypto = require("crypto");
const sendEmail = require("../util/Email");
const bcrypt = require("bcrypt");
require('dotenv').config();

// Route to create a user
router.post("/createUser", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        let user = await UserModel.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user = await new UserModel({ ...req.body, password: hashPassword }).save();

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);

        res.status(201).send({ message: "An email has been sent to your account. Please verify." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Route to verify email
router.get("/users/:id/verify/:token", async (req, res) => {
    try {
        const { id, token } = req.params;

        // Find user by userId
        const user = await UserModel.findOne({ _id: id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        // Find token by userId and token
        const tokenRecord = await Token.findOne({
            userId: user._id,
            token: token
        });
        if (!tokenRecord) return res.status(401).send({ message: "Invalid link" });

        // Check if the userId in the token matches the userId in the URL
        if (user._id.toString() !== tokenRecord.userId.toString()) {
            return res.status(401).send({ message: "Invalid link" });
        }

        // Verify the user and delete the token
        await UserModel.updateOne({ _id: user._id }, { verified: true });
        await Token.deleteOne({ _id: tokenRecord._id });

        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.put("/updateUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, phone, address } = req.body;
        console.log(firstName,lastName,phone,address)
        // Find the user by ID
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).send({ message: "User not found" });

        // Update the user fields (excluding email)
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        // Save the updated user details
        await user.save();

        res.status(200).send({ message: "User details updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/allUsers", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).send({ users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete("/deleteSiteUsers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



module.exports = router;
