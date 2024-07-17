const mongoose = require('mongoose');



const URL = 'mongodb+srv://akilamanujith:akila@cluster0.bfcnm3b.mongodb.net/crud?retryWrites=true&w=majority&appName=Cluster0'


module.exports = () => {

    return mongoose.connect(URL);

}