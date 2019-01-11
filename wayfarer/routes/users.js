var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
var db = require('../models'),
var jwt = require('jsonwebtoken')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = {
  signup : (req, res) => {
    db.User.find({email: req.body.email})
    .exec()
    .then( user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "email already exists"
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err){ 
            console.log("hashing error:", err);
            res.status(200).json({error: err})
          } else {
            db.User.create({
              email: req.body.email,
              password: hash
            }, {password: 0}, (err, result) => {
              result = result[0]
              jwt.sign(
                  {result},
                  "WAYFARER",
                  (err, signedJwt) => {
                  res.status(200).json({
                    message: 'User Created',
                    result,
                    signedJwt
                  })
                });

              })
            }
          })
        }
      })
      .catch( err => {
        console.log(err);
        res.status(500).json({err})
      })
    },
    login: (req, res) => {
        console.log("LOGIN CALLED");
        console.log("body", req.body)
        db.User.find({email: req.body.email})
          .select('+password')
          .exec()
          .then( users => {
            console.log("USERS: ", users);
            if(users.length < 1) {
              return res.status(401).json({
                message: "Email/Password incorrect"
              })
            }
            console.log("body", req.body);
            console.log("hash", users[0].password);
            bcrypt.compare(req.body.password, users[0].password, (err, match) => {
              console.log(match)
              if(err){console.log(err);return res.status(500).json({err})}
              if(match){
                console.log("MATCH: ", match)
                const token = jwt.sign(
                  {
                    email: users[0].email,
                    _id: users[0]._id
                  }, 
                  // add our super secret key (which should be hidden, not plaintext like this)
                  "WAYFARER",
                  {

                    expiresIn: "24h"
                  },
                );
                console.log("NEW TOKEN: ", token)
                return res.status(200).json(
                  {
                    message: 'Auth successful',
                    token
                  }
                )
              } else {
                console.log("NOT A MATCH")
                res.status(401).json({message: "Email/Password incorrect"})
              }
            })
      
      
          })
          .catch( err => {
            console.log("OUTSIDE ERROR_")
            console.log(err);
            res.status(500).json({err})
          })
        },
    delete: (req, res) => {
        console.log("hitting delete");
        db.User.deleteOne({_id: req.params.userId}, (err, result) =>{
          if(err){return res.status(500).json({err})}
          res.status(200).json({result})
        })
      }
}