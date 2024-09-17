const mongoose = require ('mongoose')

const InventoryOrderSchema = new mongoose.Schema({

    name: String,
    image: String,
    quantity: String,
    maxQuantity: String,
    category: String,
    
})

const InventoryOrderModel = mongoose.model("inventoryOrders",InventoryOrderSchema)
module.exports = InventoryOrderModel