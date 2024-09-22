const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

router.post("/createTable", (req, res) => {
    Table.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

router.get("/ShowTable",(req,res) => {

    Table.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))

});

router.get("/getTable/:id",(req,res) => {

    const TableId = req.params.id;
    Table.findById({_id: TableId})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

router.put("/updateTable/:id", (req, res) => {
    const tableId = req.params.id;
    const { tableNum, quantity, price } = req.body;
    
    Table.findByIdAndUpdate(tableId, { tableNum, quantity, price }, { new: true })
        .then(updatedTable => res.json(updatedTable))
        .catch(err => res.status(500).json(err));
});

router.delete("/DeleteTable/:id", (req, res) => {
    const tableId = req.params.id;
    
    Table.findByIdAndDelete(tableId)
        .then(() => res.json({ message: `Table with id ${tableId} deleted successfully.` }))
        .catch(err => res.status(500).json({ error: err.message }));
});






module.exports = router;