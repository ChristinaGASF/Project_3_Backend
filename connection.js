
const mongoose = require('mongoose')

mongoose.Promise = Promise

mongoose.connect('mongodb://localhost/walk-it-out')
    .then(connection => console.log('Connection established!'))
    .catch(err => console.log('Connection failed!', err))

module.exports = mongoose