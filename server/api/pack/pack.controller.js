'use strict';

var _ = require('lodash');
var Pack = require('./pack.model');
var mongoose = require('mongoose');

// Get list of packs
exports.index = function(req, res) {
  Pack.find(function (err, packs) {
    if(err) { return handleError(res, err); }
    return res.json(200, packs);
  });
};

// Get a single pack
exports.show = function(req, res) {
  Pack.findById(req.params.id, function (err, pack) {
    if(err) { return handleError(res, err); }
    if(!pack) { return res.send(404); }
    return res.json(pack);
  });
};

// Creates a new pack in the DB.
exports.create = function(req, res) {
  if (req.body.owners) {
    if (req.body.owners instanceof Array == false) {
      req.body.owners = [req.body.owners]
    }
  }
  Pack.create(req.body, function(err, pack) {
    if(err) { return handleError(res, err); }
    return res.json(201, pack);
  });
};

// Updates an existing pack in the DB.
exports.update = function(req, res) {
  console.log("body", req.body)
  if (req.body.owners) {
    if (req.body.owners instanceof Array == false) {
      req.body.owners = [req.body.owners];
    }
  }
  if(req.body._id) { delete req.body._id; }

  Pack.findById(req.params.id, function (err, pack) {
    if (err) { return handleError(res, err); }
    if(!pack) { return res.send(404); }
    var updated = _.merge(pack, req.body);
    pack.owners = [];
    for (var i = req.body.owners.length - 1; i >= 0; i--) {
      pack.owners.push(req.body.owners[i]);
    }
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      console.log("pack result",pack);
      return res.json(200, pack);
    });
  });
};

// Deletes a pack from the DB.
exports.destroy = function(req, res) {
  Pack.findById(req.params.id, function (err, pack) {
    if(err) { return handleError(res, err); }
    if(!pack) { return res.send(404); }
    pack.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}