var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../modules/auth')


router.get('/', function(req, res, next) {   
  res.render('index', { title: 'this is post js' });
});
router.post('/newpost', function(req, res) {
  
  var title = req.body.title;
  var body = req.body.body;
  var city = req.body.cityid;
  var date = req.body.date;
  var userid = req.body.userid;
  var cityid = req.body.cityid
  var token = req.body.token
  console.log(token);
  auth.getIdFromToken(token, (err,data)=>{
    console.log(data.data);
    db.posts.create({
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
  })

  
  
});

router.get('/city/:id', function(req,res){
  db.posts.find({cityid: req.params.id }).exec(function(err, data){
    if(err){
      res.json({"error":err})
    }else{
      const posts = data.map((post, index)=>{
        return {
          "cityid": post.cityid,
        "title": post.title,
        "body": post.body,
        "image": post.pic}
          
        
      
      })
      res.json(posts)
      }
    })
  })
module.exports = router;
