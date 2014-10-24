'use strict';

var _ = require('lodash');
var Promo = require('./promo.model');

// Get list of promos
exports.index = function(req, res) {
  Promo.find(function (err, promos) {
    if(err) { return handleError(res, err); }
    return res.json(200, promos);
  });
};

// Get a single promo
exports.show = function(req, res) {
  Promo.findById(req.params.id, function (err, promo) {
    if(err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }
    return res.json(promo);
  });
};

// Creates a new promo in the DB.
exports.create = function(req, res) {
  Promo.create(req.body, function(err, promo) {
    if(err) { return handleError(res, err); }
    return res.json(201, promo);
  });
};

// Updates an existing promo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Promo.findById(req.params.id, function (err, promo) {
    if (err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }
    var updated = _.merge(promo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, promo);
    });
  });
};

// Deletes a promo from the DB.
exports.destroy = function(req, res) {
  Promo.findById(req.params.id, function (err, promo) {
    if(err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }
    promo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}