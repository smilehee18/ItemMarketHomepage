const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const commentSchema = new mongoose.Schema({
    itemid : {
        type :String,
        required : true
    },
    name : {
        type : String,
        required : true 
    },
    content : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now
    },
    versionKey : false
})

module.exports = mongoose.model('Comment', commentSchema);