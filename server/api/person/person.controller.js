'use strict';

var _ = require('lodash');
var Person = require('./person.model');
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
      last_name: data.last_name,
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

// Creates a new person in the DB.
exports.create = function(req, res) {
  Person.create(req.body, function(err, person) {
    if(err) { return handleError(res, err); }
    return res.json(201, person);
  });
};

// Updates an existing person in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Person.findById(req.params.id, function (err, person) {
    if (err) { return handleError(res, err); }
    if(!person) { return res.send(404); }
    var updated = _.merge(person, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
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

function handleError(res, err) {
  return res.send(500, err);
}