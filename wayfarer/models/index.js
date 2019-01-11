const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/wayfarer" );

const posts     = require('./db.post');
const users   = require('./db.user');
const cities   = require('./db.cities');

module.exports = {
    posts   : posts,
    users  : users,
    cities : cities
}