const express = require('express');
const router = express.Router();
const Employee = require('../models/Employees');

router.post("/createEmployee", (req, res) => {
    Employee.create(req.body)
        .then(Employees => res.json(Employees))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
