const mongoose = require('mongoose');

const cities = new mongoose.Schema({
    name:String,
    country:String,
    pic:String    
});
module.exports = mongoose.model('cities',cities); 