const mongoose = require('mongoose');

const posts = new mongoose.Schema({
    title:String,
    body:String,
    city: String,
    date:Number,
    pic:String,
    commentStatus:Boolean,
    userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        },
    
});
module.exports = mongoose.model('users',posts); 