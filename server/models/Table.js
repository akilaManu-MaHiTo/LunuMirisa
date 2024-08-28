const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    tableId: String,
    quantity: String,
    price: String,
    tableNum: String,
});

const TableModel = mongoose.model("tables", TableSchema);
module.exports = TableModel;
