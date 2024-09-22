const mongoose = require('mongoose');

const OrderTableSchema = new mongoose.Schema({
  tableNum: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'ongoing' } // Correct syntax for default value
});

const OrderTableModel = mongoose.model('orderTables', OrderTableSchema);
module.exports = OrderTableModel;
