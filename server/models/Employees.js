const mongoose = require ('mongoose')

const EmployeeSchema = new mongoose.Schema({

    EmName: String,
    email: String,
    EmAge: Number,
    EmPassword: String,
    EmType: String

})

const EmployeeModel = mongoose.model("employees",EmployeeSchema)
module.exports = EmployeeModel