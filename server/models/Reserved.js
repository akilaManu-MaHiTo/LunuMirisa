const mongoose = require('mongoose');

const ReservedTableSchema = new mongoose.Schema({
    quantity: { type: String, required: true },
    price: { type: String, required: true },
    tableNum: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is your user collection
        required: true
    }
});

module.exports = mongoose.model('ReservedTables', ReservedTableSchema);
