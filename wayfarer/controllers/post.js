var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../modules/auth')
const multer = require(`multer`);
const storage = multer.diskStorage({
  destination: `./public/images/upload`,
  filename: function (req, file, cb) {
    let name = file.originalname.split(`.`);
    cb(null, file.originalname + `-` + Date.now() + "." + name[1]);
  }
});
const upload = multer({
  storage: storage
});

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'this is post js'
  });
});

router.post('/newpost', upload.single("img"), function (req, res) {
  var title = req.body.title;
  var body = req.body.body;
  var city = req.body.cityid;
  var date = req.body.date;
  var cityid = req.body.cityid
  var token = req.body.token
  if (body.replace(/\s/g, '') == '' || title.replace(/\s/g, '') == '') {
    var message = (body.replace(/\s/g, '') == "") ? "Post Content is empty" : "Post title is empty";
    res.json({
      "message": message,
      "status": false
    });
  } else if (title.length > 200) {
    res.json({
      "message": "Post title mustnot exceed more than 200 character",
      "status": false
    });
  } else {
    auth.getIdFromToken(token, (err, data) => {
      db.posts.create({
        title: title,
        body: body,
        city: city,
        date: new Date(),
        userid: data.data,
        cityid: cityid,
        pic: (req.file != undefined && req.file != "") ? req.file.filename : "none"
      }, function (err, data) {
        if (err) {
          res.status(500).json({
            "message": err,
            "status": false
          });
        } else {
          res.json({
            "message": "Post created sucessfully",
            "status": true
          });
        }
      });
    })
  }
});

router.get('/show/:id', function (req, res) {
  console.log(req.params.id);
  db.posts.find({
    _id: req.params.id
  }).exec(function (err, data) {
    if (err) {
      res.json({
        "error": err
      })
    } else {
      console.log(data);
      res.json({
        data
      })
    }
  })
})

router.delete('/:id', function (req, res) {
  db.posts.findOneAndDelete({
    _id: req.params.id
  }).exec(function (err, data) {
    if (err) {
      res.json({
        "error": err
      })
    } else {
      res.json({
        data
      })
      console.log("deleted");
    }
  })
})

router.post('/edit/:id', function (req, res) {
  var title = req.body.title
  var body = req.body.body
  db.posts.findOneAndUpdate({
    _id: req.params.id
  }, {
    "title": title,
    "body": body
  }).exec(function (err, data) {
    if (err) {
      res.json({
        "error": err
      })
    } else {
      db.posts.find({
        _id: data._id
      }).exec(function (err, postData) {
        if (err) {
          res.useChunkedEncodingByDefault({
            "error": err
          })
        } else {
          res.json(postData)
        }
      });
    }
  })
})

router.get('/city/:id', function (req, res) {
  db.posts.find({
    cityid: req.params.id
  }).populate("userid").sort({
    date: "desc"
  }).exec(function (err, data) {
    if (err) {
      res.json({
        "error": err
      })
    } else {
      const posts = data.map((post, index) => {
        return {
          "cityid": post.cityid,
          "title": post.title,
          "body": post.body,
          "image": post.pic,
          "id": post._id,
          "user": post.userid,
          "date": ((Date.now() - post.date) / 60000).toFixed(1)
        }
      })
      res.json(posts)
    }
  })
})

module.exports = router;