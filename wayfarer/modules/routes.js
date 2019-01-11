var express = require('express');
var router = express.Router();

var fs = require('fs');
fs.readdirSync(__dirname+'/../controllers').forEach(file => {
    router.use(`/${file.split('.')[0]}`, require(__dirname+`/../controllers/${file.split('.')[0]}`));
   
})

module.exports = router;
