'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var Person = require('./person.model');
var Promo = require(config.root+'/server/api/promo/promo.model');
var https = require('https');

// Get list of persons
exports.index = function(req, res) {
  Person.find(function (err, persons) {
    if(err) { return handleError(res, err); }
    return res.json(200, persons);
  });
};

// Get a single person
exports.show = function(req, res) {
  Person.findById(req.params.id, function (err, person) {
    if(err) { return handleError(res, err); }
    if(!person) { return res.send(404); }
    return res.json(person);
  });
};

exports.fb_connect = function  (req, res) {
  console.log("query",req.query);
  console.log("params", req.params);
  var facebookURL = 'https://graph.facebook.com/v2.3/me?';
  var fields = 'fields=id,name,birthday,email,first_name,last_name,picture,gender';
  var token = req.query.accessToken || '';
  var userID = req.query.userID || '';
  var url = facebookURL+fields+'&access_token='+token;
  var person = { name: 'paxo', userID:'123 ', accessToken:'asdasd'};
  var createPerson = function (data) {
    console.log("data create",data);
    var person ={
      name: data.first_name,
      lastname: data.last_name,
      gender: data.gender,
      email: data.email,
      birth: data.birthday,
      picture: {
        path: data.picture.data.url
      },
      facebook: data
    }
    person.facebook.token = token;

    console.log("person to save", person);
    Person.create( person , function(err, person) {
      console.log("saved person", person);
      if(err) { return handleError(res, err); }
      return res.json(201, person);
    });
  }
  var checkPerson = function (user) {
    console.log("user",user.id);
    Person.findOne({'facebook.id':user.id}, function (err, person) {
      if (err) { return handleError(res, err); }
      if(!person) {
        createPerson(user);
      }else{
        console.log("check person", person);
        return res.json(200, person);
      }
    });
  }

  console.log('url',url);

  https.get(url, function(resf) {
    var body = '';

    resf.on('data', function(chunk) {
      body += chunk;
    });

    resf.on('end', function() {
      var fbResponse = JSON.parse(body);
      if (!fbResponse.err) {
        checkPerson(fbResponse);
      }else{
        return res.json(500);
      }
    });
  }).on('error', function(e) {
    console.log("Got error: ", e);
    return res.json(500);
  });

}

exports.notification = function (req, res) {
  var gcm = require('node-gcm');
  var notification_id = req.params.id;
  var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        message: 'Mensaje',
        title: 'Esto es título',
        msgcnt: 1
    }
  });

  var sender = new gcm.Sender('AIzaSyBMAp1zbWGp-Z1LM2UdiGxNSw6Te5oYSlg');

  sender.send(message, [notification_id], 4, function (err, result) {
      console.log("error",err);
      console.log("resultado",result);
      if (!err) {
        res.status(200);
        res.json('Parece bien :3');
      }else{
        res.status(500);
        res.json('Error al enviar mensaje');
      }
  });
}

// Creates a new person in the DB.
exports.create = function(req, res) {
  Person.create(req.body, function(err, person) {
    if(err) { return handleError(res, err); }
    return res.json(201, person);
  });
};

// Updates an existing person in the DB.
exports.update = function(req, res) {
  console.log("req.body",req.body);

  var sendNotification = function (promoId, person) {
    var gcm = require('node-gcm');
    var notification_id = person.notification_id;
    var sender = new gcm.Sender('AIzaSyBMAp1zbWGp-Z1LM2UdiGxNSw6Te5oYSlg');
    var regexHTML = /(<([^>]+)>)/ig;

    Promo.findById(promoId, function (err, promo) {
      console.log('promoción',promo);
      var promoTitle = promo.title.es.replace(regexHTML,'');
      var promoName = promo.promo.es.replace(regexHTML,'');
      var message = new gcm.Message({
        collapseKey: 'demo',
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
          message: promoName +' - '+ promoTitle,
          title: 'Nueva promoción para '+person.name,
          msgcnt: 1
        }
      });
      console.log('mensaje a enviar',message);
      console.log('notification_id',notification_id);
      sender.send(message, [notification_id], 4, function (err, result) {
          console.log("error de enviar notification",err);
          console.log("resultado de enviar notification",result);
      });
    });
  }

  if(req.body._id) { delete req.body._id; }
  Person.findById(req.params.id, function (err, person) {
    console.log("err1",err);
    console.log("person",person);
    var newPromo = null;
    if (err) { return handleError(res, err); }
    if(!person) { return res.send(404); }
    if (req.body.preferences) {
      person.preferences = req.body.preferences;
      delete req.body.preferences;
    }
    if (req.body.promos) {
      //si el array nuevo es más grande que el existente entonces hay un nuevo valor
      if (person.promos.length < req.body.promos.length) {
        // Se supone que el nuevo valor el es último
        newPromo = req.body.promos[ req.body.promos.length - 1 ];
      }
      person.promos = req.body.promos;
      delete req.body.promos;
    };
    if (req.body.likes) {
      person.likes = req.body.likes;
      delete req.body.likes;
    };
    var updated = _.merge(person, req.body);

    console.log('updated', person);
    updated.save(function (err,person) {
      console.log("err2",err);
      console.log("saved",person);
      if (err) { return handleError(res, err); }
      if (!err && newPromo) {
        sendNotification(newPromo, person)
      }
      return res.json(200, person);
    });
  });
};

// Deletes a person from the DB.
exports.destroy = function(req, res) {
  Person.findById(req.params.id, function (err, person) {
    if(err) { return handleError(res, err); }
    if(!person) { return res.send(404); }
    person.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.promos = function (req, res) {
  Person.findById(req.params.id)
  .populate({
    path: 'promos',
    match: { dateStart: {$lte: Date.now()}, dateEnd: {$gt: Date.now()} },
  })
  .exec(function (err, person) {
    if(err) { return handleError(res, err); }
    if(!person) { return res.send(404); }

    Person.populate(person,{
      path: 'promos.owner',
      model: 'User'
    },function (err, populated) {
      console.log('populated',err,populated);
      return res.json(person);
    })

  })
}

function handleError(res, err) {
  return res.send(500, err);
}