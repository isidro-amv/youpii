'use strict';

var User = require('./user.model')
  , passport = require('passport')
  , config = require('../../config/environment')
  , images = require(config.root+'/server/components/images')
  , s3 = require('s3')
  , s3Options = require(config.root+'/server/components/s3')
  , clientS3 = s3.createClient(s3Options.options)
  , jwt = require('jsonwebtoken')
  , fs = require('fs')
  , gm = require('gm').subClass({ imageMagick: true });

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {

  console.log(req.files);
  console.log(req.body);
  var picDesc = [];
  var splitName = '';
  var uploader = [], uploader2 = [];


  if (req.body.loc) { req.body.loc = req.body.loc.split(',') };

  if (req.files) {
    if (req.files.logo) {
      req.body.logo = req.files.logo;
      req.body.logo.desc = req.body.name;

      /*
      // Delete Objects
      uploader[12] = clientS3.deleteObjects({
        Bucket: s3Options.bucket,
        Delete: {
          Objects:[{
            Key: '164cffaed0cca859e0b2cee60206194a-no.jpg'
          }]
        }
      },function (err,data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });*/

      Object.keys(images.logo).forEach(function( el, i){
        images.logo[el].dir = addSufixText(req.body.logo.path, images.logo[el].sufix);

        gm(req.body.logo.path)
        .resize(images.logo[el].width,images.logo[el].width)
        .write(images.logo[el].dir, function (err) {
          if (!err) {
            /*uploader[i] = clientS3.uploadFile({
              localFile: images.logo[el].dir,
              s3Params: {
                ACL: 'public-read',
                Bucket: s3Options.bucket,
                Key: images.logo[el].dir.split('/').slice(-1)[0]
              },
            });
            uploader[i].on('end', function(err,i) {
              console.log("done uploading",err,i);
            });*/
          }else{
            console.log(err);
          }
        });
      });
      delete req.body.path;
      req.body.logo.pathBig = generateS3Url(req.body.name,images.logo.big.sufix);
      req.body.logo.pathNormal = generateS3Url(req.body.name,images.logo.normal.sufix);
      req.body.logo.pathSmall = generateS3Url(req.body.name,images.logo.small.sufix);
      req.body.logo.paththumb = generateS3Url(req.body.name,images.logo.thumb.sufix);
    }

    // asigna la descripción a un array de imágenes
    if (req.files.pic) {
      if (req.body.pic) {
        picDesc = req.body.pic.desc;
      }
      req.body.pic = req.files.pic;
      if( Object.prototype.toString.call( req.body.pic ) !== '[object Array]' ) {
        req.body.pic = [req.body.pic];
      }
      if ( typeof picDesc == 'string') {
        picDesc = [picDesc];
      }
      for (var i = picDesc.length - 1; i >= 0; i--) {
        if (req.body.pic[i]) {
          req.body.pic[i].desc = picDesc[i];
        }
      }

      Object.keys(images.gallery).forEach(function (key, i) {
        Object.keys(req.body.pic).forEach(function (i2) {
          images.gallery[key].dir = addSufixText(req.body.pic[i2].path, images.gallery[key].sufix);
          gm(req.body.pic[i2].path)
            .resize(images.gallery[key].width,images.gallery[key].height, '^')
            .gravity('Center')
            .crop(images.gallery[key].width,images.gallery[key].height)
            .write(images.gallery[key].dir, function (err) {
              if (!err) {
                /*uploader2[i] = clientS3.uploadFile({
                  localFile: images.gallery[key].dir,
                  s3Params: {
                    ACL: 'public-read',
                    Bucket: s3Options.bucket,
                    Key: images.gallery[key].dir.split('/').slice(-1)[0]
                  },
                });
                uploader2[i].on('end', function(err,i) {
                  console.log("done uploading",err,i);
                });*/
              }else{
                console.log(err);
              }
            });
          });
      });

      Object.keys(req.body.pic).forEach(function (i) {
        delete req.body.pic[i].path;
        req.body.pic[i].pathBig = generateS3Url(req.body.pic[i].name,images.gallery.big.sufix);
        req.body.pic[i].pathNormal = generateS3Url(req.body.pic[i].name,images.gallery.normal.sufix);
        req.body.pic[i].pathLarge = generateS3Url(req.body.pic[i].name,images.gallery.large.sufix);
        req.body.pic[i].pathSlim = generateS3Url(req.body.pic[i].name,images.gallery.slim.sufix);
      });
      console.log(images.gallery);
    }
  };

  var newUser = new User(req.body);

  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    // Activar esto si queremos que el usuario creado mantenga una sessión
    // var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    // res.json({ token: token });
    res.json(200,{status:"OK"});
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Update user info
 */
exports.update = function(req, res, next) {
  var userId = req.params.id;
  var picDesc = [];
  User.findById(userId, function (err, user) {


    // Update info
    user.name = req.body.name || user.name;
    user.url = req.body.url || user.url;
    user.businessName = req.body.businessName || user.businessName;
    if (req.body.contact) {
      user.contact.name = req.body.contact.name || user.contact.name;
      user.contact.tel = req.body.contact.tel || user.contact.tel;
    }
    user.tel = req.body.tel || user.tel;
    user.cel = req.body.cel || user.cel;
    user.dir = req.body.dir || user.dir;
    user.city = req.body.city || user.city;
    user.logo = req.body.logo || user.logo;
    user.pic = req.body.pic || user.pic;
    user.email = req.body.email || user.email;
    user.urlWebsite = req.body.urlWebsite || user.urlWebsite;
    if (req.body.social) {
      user.social.facebook = req.body.social.facebook || user.social.facebook;
      user.social.pinterest = req.body.social.pinterest || user.social.pinterest;
      user.social.twitter = req.body.social.twitter || user.social.twitter;
      user.social.instagram = req.body.social.instagram || user.social.instagram;
    }
    if (req.body.loc ) {
      user.loc = req.body.loc.split(',');
    }
    if (req.files) {

      if (req.files.logo) {
        user.logo = req.files.logo;
        user.logo.desc = req.body.name;
      }

      // asigna la descripción a un array de imágenes
      if (req.files.pic) {
        if (req.body.pic) {
          picDesc = req.body.pic.desc;
        }

        user.pic = req.files.pic;
        if( Object.prototype.toString.call( user.pic ) !== '[object Array]' ) {
          user.pic = [user.pic];
        }
        if ( typeof picDesc == 'string') {
          picDesc = [picDesc];
        }
        for (var i = picDesc.length - 1; i >= 0; i--) {
          if (user.pic[i]) {
            user.pic[i].desc = picDesc[i];
          }
        }
      }
    }

    user.save(function(err) {
      if (err) return validationError(res, err);
      res.json(200,{status:"OK"});
    });
  });
};


/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};


function addSufixText (str,sufix) {
  var splitName = str.split('.');
  splitName[splitName.length-2] = splitName[splitName.length-2]+sufix;
  return splitName.join('.');
}

function generateS3Url (name, sufix) {
  return s3Options.url+s3Options.bucket+'/'+addSufixText(name,sufix);
}