const mongoose = require ('mongoose')

const CartSchema = new mongoose.Schema({

    userId: String,
    itemId: String,
    category: String,
    type: String,
    price: String

})

const CartModel = mongoose.model("carts",CartSchema)
module.exports = CartModel