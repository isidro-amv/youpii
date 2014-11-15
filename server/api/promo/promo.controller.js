'use strict';

var _ = require('lodash');
var Promo = require('./promo.model');
var config = require('../../config/environment')
var s3 = require(config.root+'/server/components/s3')

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
  console.log("promo-body",req.body);
  console.log("promo-files",req.files);

  var promo = req.body;
  promo.images = [];

  if (req.body.category) {
    if (!(req.body.category instanceof Array)) {
      req.body.category = [req.body.category];
    }
  }

  if (req.files) {

    // se agrega al array la gallería
    if (req.files.images) {
      // si no es array de imágenes crea uno
      if (!(req.files.images instanceof Array) ) {
        req.files.images = [req.files.images];
      }
      //si no es array de descripción crea uno
      if (req.body.imagesdesc) {
        if (!(req.body.imagesdesc instanceof Array) ) {
          req.body.imagesdesc = [req.body.imagesdesc];
        }
        // asigna descripción a cada una de las imagenes
        for (var i = 0; i < req.files.images.length; i++) {
          req.files.images[i].desc = req.body.imagesdesc[i];
        }
      }
      promo.images = s3.uploadFile(req.files.images,'gallery');
    }

    // se agrega al array la imagen principal
    if (req.files.imagemain) {
      req.files.imagemain.desc = req.body.imagemaindesc || '';
      promo.imagemain = s3.uploadFile(req.files.imagemain,'gallery');
      if (req.files.imagemainCrop) {
        promo.imagemain.paths.slim = s3.oneUploadFile(req.files.imagemainCrop,{kind:'gallery',size:'slim'});
      }
    }

  }

  console.log("save this promos->",promo);
  Promo.create(promo, function(err, promo) {
    if(err) { return handleError(res, err); }
    return res.json(201, promo);
  });
};

// Updates an existing promo in the DB.
exports.update = function(req, res) {
  // hay una sospecha de los updates de array no funcionan
  console.log("hola mundo");
  console.log("body->", req.body);
  console.log("files->",req.files);
  var filesToUpload = [], filesToDelete = [];
  if(req.body._id) { delete req.body._id; }
  Promo.findById(req.params.id, function (err, promo) {

    if (req.files) {

      // si el usuario actual tienen elementos, eliminará los elementos y enlistará los elementos
      // para eliminarlos del S3 también enlistará los nuevos elmentos a subir
      if (req.files.images) {
        s3.deleteFiles(promo.images);
        // si no es array de imágenes crea uno
        if (!(req.files.images instanceof Array) ) {
          req.files.images = [req.files.images];
        }
        if (!(req.body.imagesdesc instanceof Array) ) {
          req.body.imagesdesc = [req.body.imagesdesc];
        }

        //si existe la descripciónde de la imagen
        if (req.body.imagesdesc) {
          // asigna descripción a cada una de las imagenes
          for (var i = 0; i < req.files.images.length; i++) {
            req.files.images[i].desc = req.body.imagesdesc[i];
          }
        }
        promo.images = s3.uploadFile(req.files.images,'gallery');
      }

      // si el usuario actual tienen elementos, eliminará los elementos tipo main y enlistará los elementos
      // para eliminarlos del S3 también enlistará los nuevos elementos a subir
      if (req.files.imagemain) {
        console.log("to delete->", promo.imagemain);
        s3.deleteFiles(promo.imagemain);
        promo.imagemain = s3.uploadFile(req.files.imagemain,'gallery');
        promo.imagemain.desc = req.body.imagemaindesc || '';
        if (req.files.imagemainCrop) {
          promo.imagemain.paths.slim = s3.oneUploadFile(req.files.imagemainCrop,{kind:'gallery',size:'slim'});
        }
      }
    }

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
    s3.deleteFiles(promo.imagemain);
    s3.deleteFiles(promo.images);
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