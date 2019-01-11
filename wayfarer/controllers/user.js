var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {   
  res.render('index', { title: 'this is user js' });
});
router.get('/test', function(req, res, next) {   
    res.render('index', { title: 'this is user jstest' });
});
  

module.exports = router;
