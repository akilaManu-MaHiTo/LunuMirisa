const mongoose = require ('mongoose')

const ProfileSchema = new mongoose.Schema({

    userId: String,
    image: String,
    

})

const ProfileModel = mongoose.model("profiles",ProfileSchema)
module.exports = ProfileModel