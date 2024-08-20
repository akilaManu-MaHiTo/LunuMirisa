const router = require("express").Router();
const { User, validate } = require("../models/Users");
const bcrypt = require("bcrypt");

router.post("/createUser", async (req, res) => {
	try {
		// Validate the user input
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}

		// Check if the user already exists
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(409).send({ message: "User with the given email already exists!" });
		}

		// Hash the password before saving the user
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// Create and save the new user
		const newUser = new User({ ...req.body, password: hashedPassword });
		await newUser.save();

		// Send a success response
		res.status(201).send({ message: "User created successfully" });
	} catch (err) {
		// Handle any unexpected errors
		console.error("Error creating user:", err);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
