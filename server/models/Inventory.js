const mongoose = require ('mongoose')

const InventorySchema = new mongoose.Schema({

    name: String,
    image: String,
    quantity: String,
    maxQuantity: String,
    
})

const InventoryModel = mongoose.model("inventories",InventorySchema)
module.exports = InventoryModel