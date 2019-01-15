var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../modules/auth')
const multer = require(`multer`);
const storage = multer.diskStorage({
   destination: `./public/images/upload`,
   filename: function(req, file, cb) {
       let name = file.originalname.split(`.`);
       cb(null, file.originalname + `-` + Date.now()+"."+name[1]);
   }
});
const upload = multer({ storage: storage});


router.get('/', function(req, res, next) {   
  res.render('index', { title: 'this is post js' });
});
router.post('/newpost', upload.single("img"), function(req, res) {
  
  var title = req.body.title;
  var body = req.body.body;
  var city = req.body.cityid;
  var date = req.body.date;
  var userid = req.body.userid;
  var cityid = req.body.cityid
  var token = req.body.token
 
  auth.getIdFromToken(token, (err,data)=>{
    
    db.posts.create({
      title: title,
      body: body,
      city: city,
      date: date,
      userid: data.data,
      cityid: cityid,
      pic: req.file.filename
   }, function (err, data) {
     if(err){
      res.status(500).json({"message":err,"status":false});
     }
     else{
         
     }
  });
  })

  
  
});
router.delete('/:id', function(req,res){
  db.posts.findOneAndDelete({id:req.params._id}).exec(function(err, data){
    if(err){
      res.json({"error": err})
    }else {
      res.json({data})
      console.log("deleted");
    }
  })


})
router.post('/edit/:id', function(req,res){
  var title = req.body.title
  var body = req.body.body
  var image = req.body.img
  db.posts.findOneAndUpdate({id:req.params._id}).exec(function(err,data){
    if(err){
      res.json({"error": err})
    }else{

      return{
        "title": data.title,
        "body": data.body
      }
      
    }
  })
  
})


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
        "image": post.pic,
        "id": post._id
      }
          
        
      
      })
      res.json(posts)
      }
    })
  })
module.exports = router;
