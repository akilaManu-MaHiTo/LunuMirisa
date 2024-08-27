const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    tableId: String,
    quantity: String,
    date: String,
    price: String,
    time: String,
    tableNum: String,
});

const TableModel = mongoose.model("tables", TableSchema);
module.exports = TableModel;
