var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/', function(req, res, next) {   
  res.render('index', { title: 'this is user js' });
});
router.post('/newpost', function(req, res) {   
  var title = req.body.title;
  var body = req.body.body;
  var city = req.body.cityid;
  var date = req.body.date;
  var userid = req.body.userid;
  var cityid = req.body.cityid
  
  db.post.create({
    title: title,
    body: body,
    city: city,
    date: date,
    userid: userid,
    cityid: cityid
 }, function (err, data) {
   if(err){
    res.status(500).json({"message":err,"status":false});
   }
   else{
        console.log(data);
   }
});
  
});
module.exports = router;
