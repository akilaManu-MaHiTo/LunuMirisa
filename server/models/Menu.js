const mongoose = require ('mongoose')

const MenuSchema = new mongoose.Schema({

    Image:String,
    Price:Number,
    Type:String,
    Category:String
})

const MenuModel = mongoose.model("menus",MenuSchema)
module.exports = MenuModel