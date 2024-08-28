const mongoose = require('mongoose');

const ReservedTableSchema = new mongoose.Schema({
    quantity:String,
    price:String,
    tableNum:String,
    date:String,
    time:String
});

module.exports = mongoose.model('ReservedTables',ReservedTableSchema );
