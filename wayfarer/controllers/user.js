var express = require('express');
var router = express.Router();
var auth   = require('../modules/auth');
var db       = require('../models');
var bcrypt     = require('bcryptjs');



router.get('/', function(req, res, next) {   
  res.render('index', { title: 'this is user js' });
});
router.post('/login', function(req, res) {   
    
    var username = req.body.username;
    var password = req.body.password;
    
    auth.validateLogin(username,password,function(err,data){
        if(err){
            if(err==='invalidUsername' || err==='invalidPassword'){
                res.json({"message":"invalid username or password","status":false})
            }
            else{
                res.status(500).json({"message":"invalid username or password","status":false})
            }
        }
        else{
            res.set({
                
            }).json({"message":"login successful", "status":true,'token': auth.genToken(data._id)})
        }
        
    });
});
router.post('/signup', function(req, res) {   
       
    var username = req.body.username;
    var password = req.body.password;
    var conPassword = req.body.conpassword;
   
    if(password  !== conPassword){
        res.json({"message":"Password not match with Conform Password","status":false})
    }
    else{
        bcrypt.hash(password, 8, function(err, hash) {
            if(err){
                
                res.status(500).json({"message":"password error found","status":false});
            }
            else{
               
                db.users.create({
                    username:username,
                    password:hash,
                    profilePic:'none'
                 }, function (err, data) {
                   if(err){
                    res.status(500).json({"message":err,"status":false});
                   }
                   else{
                        res.json({"message":"Login sucessfully","status":true});
                        
                   }
                });
            }
        }); 
    }  
});
router.put('/edit/:type',function(req,res){
    var types = ['name','city','profilePic','username','password'];
    var paramData = req.params.type;
    if(!types.includes(paramData)){
        res.status(400).json({"message":"invalid request","status":false});
    }else{
       
        if(paramData ==='name'){
           
        }
    }
});
module.exports = router;
