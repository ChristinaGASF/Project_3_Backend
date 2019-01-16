
    var express = require('express');
    var router = express.Router();
    var auth  = require('../modules/auth');
    var db    = require('../models');
    var bcrypt   = require('bcryptjs');
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
    var city = req.body.city
    
    if(password !== conPassword){
        res.json({"message":"Password not match with Conform Password","status":false})
    }
    else{
        db.users.findOne({ username: username }, function (err,data) {
            if(err){
                res.status(500).json({"message":"retry later","status":false});
            }
            else if(data==null){
                bcrypt.hash(password, 8, function(err, hash) {
                    if(err){
                        
                        res.status(500).json({"message":"password error found","status":false});
                    }
                    else{
                        
                        db.users.create({
                        username:username,
                        date: new Date (),
                        password:hash,
                        profilePic:'none',
                        city: city
                        }, function (err, data) {
                        if(err){
                        res.status(500).json({"message":err,"status":false});
                        }
                        else{
                            res.json({"message":"Sucessfully signup","status":true});
                            
                        }
                        });
                    }
                }); 
            }
            else{
                res.json({"mesage":"username already exist","status":false})
            }
           
        });
        
    } 
});
router.put('/edit/profile',function(req,res){
    
    var fullname = req.body.fullname;
    var updateData = {};
    var city = req.body.city;
    var token = req.body.token
    
    auth.getIdFromToken(token, (err,data)=>{
        
        if(err){
        res.status(500).json({"message":"Invalid token"});
        }
        else{
        if(city!= undefined && city !=''){
            updateData.city = city;
        }
        if(fullname!= undefined && fullname !=''){
            updateData.fullname = fullname;
        }
        console.log(updateData)
        db.users.findOneAndUpdate({_id:data.data},updateData,(err,updates)=>{
            if(err){
            res.json({"message":"error in updates","status":false})
            }
            else{
            res.json({"data":updates,"status":true})
            }
        })
        } 
    });
    });
    router.post('/post', function(req,res){
    var token = req.body.token
    auth.getIdFromToken(token, (err,data)=>{
        console.log(data.data);
        db.posts.find({userid:data.data}).exec(function(err,posts){
            if(err){
                res.status(500).json({"error": err});
            } else{
                res.json(posts);
            }

        })
    })
    // auth.getIdFromToken(token, (err,data)=>{
    //     if(err){
    //     res.json({"message":"invalid token","status":false});
    //     }
    //     else{
    //     db.posts.find({userid: data.data }).exec(function(err, data){
    //         if(err){
    //         res.json({"error":err})
    //         }else{
    //         const posts = data.map((post, index)=>{
    //         return {
    //             "cityid": post.cityid,
    //             "title": post.title,
    //             "body": post.body,
    //             "image": post.pic
    //             }
    //         });
    //         res.json(posts)
    //         }
    //     })
    //     }
        
    // });
    });
    router.post('/profile',function(req,res){
        var token = req.body.token;
        auth.getIdFromToken(token, (err,data)=>{
        if(err){
            res.json({
            "message":"Internal server error",
            "status":false
            })
        }
        else{
            db.users.findOne({_id:data.data},function(err,userdata){
            
            if(err){
                res.json({
                "message":"invalid query",
                "status":false
                })
            }else{
                res.json({
                "data":{
                    "fullname":userdata.fullname,
                    "profilePic":userdata.profilePic,
                    "city": userdata.city,
                    "date":userdata.date,
                },
                "status":true
                })
            }
            });
        }
    
        });
    });
    module.exports = router;
