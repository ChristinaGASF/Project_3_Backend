var passport =  require('passport');
var db       = require('../models');
var bcrypt     = require('bcryptjs');
var jwt = require('jsonwebtoken');
module.exports ={
    secretKey:'Cf_o&{hTbi}oyzLFmk5Khq(wrrh*D1',
    validateLogin:(username,password,cb)=>{       
        db.users.findOne({ username: username }, function (err,data) {
            
            if(err){
                cb('internal error',null);
            }
            else{
                if(data==null){
                    cb('invalidUsername',null)
                }
                else{
                    bcrypt.compare(password, data.password).then((res) => {
                        if(res===false){
                            cb('invalidPassword',null);
                        }
                        else{
                            cb(false,data)
                            console.log(password);
                        }
                    });
                }
                
            }
        });

    },
    genToken:function(data){
        return jwt.sign({ data: data }, this.secretKey);
    },
    getIdFromToken(token,cb){
    
        jwt.verify(token, this.secretKey, function(err, data) {
            if(err){
                cb("error",null);
            }
            else{
                cb(false,data);
            }
        });
    }
}