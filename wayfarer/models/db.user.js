const mongoose = require('mongoose');

const users = new mongoose.Schema({
    fullname:String,
    profilePic:String,
    city: String,
    date:Number,
    username:String,
    password:String
});

module.exports = mongoose.model('users',users); 