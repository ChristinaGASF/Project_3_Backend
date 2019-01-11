var express             = require('express');
var router              = express.Router();
var config              = require('../config/routes');
var fs                  = require('fs');
var defaultController   = require(__dirname+`/../controllers/${config.defaultController}`);

fs.readdirSync(__dirname+'/../controllers').forEach(file => {
   
    if(file.split('.')[0] !=='index'){
        router.use(`/${file.split('.')[0]}`, require(__dirname+`/../controllers/${file.split('.')[0]}`));
    }
})
router.use(function(req, res, next) {
    if(req.originalUrl === '/'){
       next();
    }
    else{
        if(req.xhr===true){
            res.status(403).json({"message":"page not found"});
        }else{
            res.status(403).render('pageNotFound');
        }
        
    }
});

// catch default controller
router.use('/',defaultController);

module.exports = router;
