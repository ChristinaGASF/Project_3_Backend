const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/bettingweb" );

const posts     = require('./db.post');
const users   = require('./db.user');

module.exports = {
    posts   : posts,
    users  : users,
}