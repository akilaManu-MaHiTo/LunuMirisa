const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/Users');
const protect = require('../middleware/AuthMiddleware');

// router.post("/createUserb", (req, res) => {
//     User.create(req.body)
//         .then(users => res.json(users))
//         .catch(err => res.status(500).json(err));
// });

// router.get("/",(req,res) => {

//     User.find({})
//     .then(users => res.json(users))
//     .catch(err => res.json(err))

// })

router.get("/getUser/:id",(req,res) => {

    const userId = req.params.id;
    UserModel.findById({_id: userId})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

router.put("/updatkeUser/:id",(req,res) => {
    

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

router.get('/countAllUsers', async (req, res) => {
    try {
        const userCount = await UserModel.countDocuments(); // Count all documents in the User collection
        res.status(200).json({ count: userCount });
    } catch (err) {
        res.status(500).json({ error: 'Failed to count users' });
    }
});

router.get('/user', protect, async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email })
            .select('_id firstName lastName phone address')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            id: user._id,
            firstname: user.firstName,
            lastname: user.lastName,
            phone: user.phone,
            address: user.address,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve user' });
    }
});

module.exports = router;
