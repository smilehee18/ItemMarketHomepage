const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const itemSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    },
    item : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    },
    versionKey : false
})

module.exports = mongoose.model('Item', itemSchema);