const mongoose = require ('mongoose')

const MenuSchema = new mongoose.Schema({

    title:String,
    image:String,
    price:Number,
    type:String,
    category:String
})

const MenuModel = mongoose.model("menus",MenuSchema)
module.exports = MenuModel