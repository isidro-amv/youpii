'use strict';

var _ = require('lodash');
var Category = require('./category.model');

// Get list of categorys
exports.index = function(req, res) {
  Category.find(function (err, categorys) {
    if(err) { return handleError(res, err); }
    return res.json(200, categorys);
  });
};

// Obtiene las categorías organizadas por padres e hijos
exports.indexFiltered = function(req, res) {
  var categoriesFiltered = {};

  Category.find(function (err, categories) {
    if(err) { return handleError(res, err); }

    var parents = [];
    var childs = categories;

    // genera los elementos padres e hijos
    for(var k in categories) {
      if (_.isEmpty(categories[k].parent)) {
        categories[k].childs = [];
        parents.push(categories[k]);
        childs.splice(k, 1);
      }
    }

    // asigna los hijos a los padres (un hijo puede tener múltiples padres)
    for(var k in childs){
      if (childs[k].parent && childs[k].parent.length >0) {
        for (var i = childs[k].parent.length - 1; i >= 0; i--) {
          for (var i2 = parents.length - 1; i2 >= 0; i2--) {
            if (parents[i2]._id.equals(childs[k].parent[i])) {
              parents[i2].childs.push(childs[k]);
            }
          }
        }
      }
    }

    // fix porque mongoose ignora varios elementos
    var result = [];
    for (var i = parents.length - 1; i >= 0; i--) {
      var index = result.push({}) -1;
      result[index] = _.clone(parents[i])._doc;
      result[index].childs = parents[i].childs;
    }
    return res.json(200, result);
  });
};

// Get a single category
exports.show = function(req, res) {
  Category.findById(req.params.id, function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    return res.json(category);
  });
};

// Creates a new category in the DB.
exports.create = function(req, res) {
  Category.create(req.body, function(err, category) {
    if(err) { return handleError(res, err); }
    return res.json(201, category);
  });
};

// Updates an existing category in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Category.findById(req.params.id, function (err, category) {
    if (err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    var updated = _.merge(category, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, category);
    });
  });
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  Category.findById(req.params.id, function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); }
    category.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}