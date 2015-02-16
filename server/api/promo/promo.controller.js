'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var Promo = require('./promo.model');
var User = require(config.root+'/server/api/user/user.model');
var City = require(config.root+'/server/api/city/city.model');
var Pack = require(config.root+'/server/api/pack/pack.model');
var Category = require(config.root+'/server/api/category/category.model');
var s3 = require(config.root+'/server/components/s3');
var ObjectId = require('mongoose').Types.ObjectId;

// Get list of promos
exports.index = function(req, res) {
  Promo.find(function (err, promos) {
    if(err) { return handleError(res, err); }
    return res.json(200, promos);
  });
};

// Creates a new promo in the DB.
exports.create = function(req, res) {
  console.log("promo-body",req.body);
  console.log("promo-files",req.files);

  var promo = req.body;
  promo.images = [];

  // se necesita elegir un paquete para la promoción
  if (!req.body.pack) {
    console.log("no se ha elegido un paquete");
    res.send(500);
  }

  Pack.findById(req.body.pack,function (err, pack) {
    if(err) { return handleError(res, err); }
    if(!pack) {
      console.log("No se encontró el paquete");
      return res.send(404);
    }
    if (req.body.category) {
      if (!(req.body.category instanceof Array)) {
        req.body.category = [req.body.category];
      }
    }
    if (req.body.tags) {
      if (req.body.tags.en) { req.body.tags.en = req.body.tags.en.split(','); };
      if (req.body.tags.es) { req.body.tags.es = req.body.tags.es.split(','); };
    }

    req.body.homeDelivery = req.body.homeDelivery || false;

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
        promo.imagemain.desc.en = req.body.imagemaindesc.en || '';
        promo.imagemain.desc.es = req.body.imagemaindesc.es || '';
        promo.imagemain.paths.normal = s3.oneUploadFile(req.files.imagemain,{kind:'gallery',size:'normal'});
        if (req.files.imagemainCrop) {
          promo.imagemain.paths.slim = s3.oneUploadFile(req.files.imagemainCrop,{kind:'gallery',size:'slim'});
        }
        if (req.files.imagemainlCrop) {
          promo.imagemain.paths.large = s3.oneUploadFile(req.files.imagemainlCrop,{kind:'gallery',size:'large'});
        }
      }

    }

    console.log("save this promos->",promo);
    Promo.create(promo, function(err, promo) {
      if(err) { return handleError(res, err); }
      return res.json(201, promo);
    });
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

  if (req.body.tags) {
    if (req.body.tags.en) { req.body.tags.en = req.body.tags.en.split(','); };
    if (req.body.tags.es) { req.body.tags.es = req.body.tags.es.split(','); };
  }

  req.body.homeDelivery = req.body.homeDelivery || false;

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
        promo.imagemain.desc.en = req.body.imagemaindesc.en || '';
        promo.imagemain.desc.es = req.body.imagemaindesc.es || '';
        promo.imagemain.paths.normal = s3.oneUploadFile(req.files.imagemain,{kind:'gallery',size:'normal'});
        if (req.files.imagemainCrop) {
          promo.imagemain.paths.slim = s3.oneUploadFile(req.files.imagemainCrop,{kind:'gallery',size:'slim'});
        }
        if (req.files.imagemainlCrop) {
          promo.imagemain.paths.large = s3.oneUploadFile(req.files.imagemainlCrop,{kind:'gallery',size:'large'});
        }
      }
    }

    if (err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }

    // por alguna razón extraña el merge tampoco funciona para actualizar arrays
    // el siguiente script resuelve el problema
    if (req.body.category) {
      promo.category = req.body.category;
    }

    var updated = _.merge(promo, req.body);
    updated.save(function (err,p) {
      if (err) { return handleError(res, err); }
      console.log("saved");
      console.log(p);
      return res.json(200, p);
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

// Get a single promo
exports.visited = function(req, res) {

  if (!req.params.rank || !req.params.id) {
    res.send(500);
  };

  Promo.findById(req.params.id, function (err, promo) {
    if(err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }
    var tenVisited;

    if (req.params.rank==='visited') {
      promo.likes.visited = promo.likes.visited+1;
    }
    if (req.params.rank==='liked') {
      promo.likes.liked = promo.likes.liked+1;
    }

    tenVisited = parseInt(promo.likes.visited / 10);
    promo.likes.average = parseInt(tenVisited+ promo.likes.liked);

    promo.save();
    return res.json(promo);
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

// Get a single by unique url name
exports.showByUrl = function(req, res) {
  if (!req.params.lang || !req.params.url) {
    return res.send(404);
  }
  var url = req.params.url;
  var query = 'url.'+req.params.lang;
  var obj = {}; obj[query] = url;
  Promo.findOne(obj, function (err, promos) {
    if(err) { return handleError(res, err); }
    if(!promos) { return res.send(404); }
    return res.json(promos);
  });
};

// Get 3 items of related promotions by owner or category
exports.showBySimilar = function(req, res) {
  if (!req.params.id) {
    return res.send(404);
  }

  Promo.findById(req.params.id, function (err, promo) {
    if(err) { return handleError(res, err); }
    if(!promo) { return res.send(404); }
    // busca promociones que tenga el mismo dueño pero diferente id
    Promo.find({$and:[
      { owner: promo.owner },
      {_id: {'$ne': promo._id }},
      {dateStart: {$lte: Date.now()}},
      {dateEnd: {$gt: Date.now()}}
      ]}).limit(3).exec( function (err, promos) {
      // si no hay promociones o la cantidad es menor a 3
      if (!promos || promos.length < 3) {
        // busca promociones que tengan la misma categoría pero diferente id
        Promo.find({category: promo.category})
        .where('_id').ne(promo._id)
        .where('dateStart').lte( Date.now() )
        .where('dateEnd').gt( Date.now() )
        .limit(3).exec(function (err, promos) {
          return res.json(promos); });
      }else{
        return res.json(promos);
      }
    });
  });
};

// Get items if the promo have title or promo with the parameters words
// TODO: hacer funcionar el paginado de search (por ahora se solicita la página 0)
exports.showByTitle = function(req, res) {

  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;

  limit = limit * (page+1);
  skip = page * 8;

  console.log("page",page,"skip",skip,"limit",limit);

  // la url requiere parametro de lenguaje pero no se neccesita
  if (!req.params.words || !req.params.lang) {
    return res.send(404);
  }

  var paramsArr = req.params.words.split(" ");
  var wordsArr = [];

  for (var i = paramsArr.length - 1; i >= 0; i--) {
    if (i>6) { break }
    // agrega palabras para buscar en un array
    console.log(paramsArr[i].length);
    if(paramsArr[i].length>2){
      paramsArr[i] = paramsArr[i].trim();
      wordsArr.push(new RegExp(paramsArr[i],'i'));
    }
  }
  console.log("words to find:",wordsArr);

  Promo.find({$and:[
      { $or: [
        { 'tags.en': { $in: wordsArr } },
        { 'tags.es': { $in: wordsArr } } ]
      },
      { dateStart: {$lt: Date.now()}},
      { dateEnd: {$gt: Date.now()}} ]
    },null,{skip: skip, limit: limit}, function (err, search) {
    console.log(err);
    console.log(search);
    if(err) { return handleError(res, err); }
    if(!search) { return res.send(404); }

    return res.json(search);
  });
}

// Get items if the promo have title or promo with the parameters words
exports.showByBestOfMonth = function(req, res) {
  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  limit = limit * (page+1);
  skip = page * 8;

  Promo.find({$and:[
      { dateStart: {$gte: firstDay}},
      { dateStart: {$lte: Date.now()}},
      { dateEnd: {$gt: Date.now()}}
    ]},null,{skip: skip, limit: limit, sort: { 'likes.average': -1 }},function (err,search) {
    if(err) { return handleError(res, err); }
    if(!search) { return res.send(404); }
    return res.json(search);
  })
}

exports.showByBestEver = function(req, res) {
  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;

  limit = limit * (page+1);
  skip = page * 8;

  Promo.find({$and:[
      { dateStart: {$lte: Date.now()}},
      { dateEnd: {$gt: Date.now()}}
    ]},null,{skip: skip, limit: limit, sort: { 'likes.average': -1 }},function (err,search) {
    if(err) { return handleError(res, err); }
    if(!search) { return res.send(404); }
    return res.json(search);
  })
}

// Get the latest items visibles to the users
exports.showByLatest = function(req, res) {
  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;

  limit = limit * (page+1);
  skip = page * 8;

  Promo.find({$and:[
      { dateStart: {$lte: Date.now()}},
      { dateEnd: {$gt: Date.now()}}
    ]},null,{skip: skip, limit: limit, sort: { dateStart: -1 }},function (err,search) {
    if(err) { return handleError(res, err); }
    if(!search) { return res.send(404); }
    return res.json(search);
  })
}

// Get the latest items visibles to the users
exports.showByNear = function(req, res) {

  var coords = req.params.coords.split(',');
  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;

  limit = limit * (page+1);
  skip = page * 8;

  if (coords.length !== 2) return res.send(404);
  coords[0] = parseFloat(coords[0]);
  coords[1] = parseFloat(coords[1]);
  if (!coords[0] || !coords[1]) return res.send(404);
  console.log(coords);

  User.find({ coords : { '$near' : coords } })
  .populate('promos')
  .skip(skip).limit(limit).exec(function (err,users) {

    var promos = [];

    if(err) { return handleError(res, err); }
    if(!users) { return res.send(404); }

    for (var i = users.length - 1; i >= 0; i--) {
      if (users[i].promos) {
        for (var i2 = users[i].promos.length - 1; i2 >= 0; i2--) {
          if (!_.contains(promos, users[i].promos[i2])) {
            promos.push(users[i].promos[i2]);
          }
        }
      }
    }

    return res.json(promos);
  })
}

// Get the latest items visibles to the users
exports.showByCity = function(req, res) {
  var url = req.params.url;
  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;

  limit = limit * (page+1);
  skip = page * 8;

  console.log(url);
  City.findOne({url:url}).exec(function (err, city) {
    if(err) { return handleError(res, err); }
    if(!city) { return res.send(404); };
    console.log("city",city);
    User.find({$and:[{city:city._id}]}).populate({path:'promos',
        match:{ $and:[
          { dateStart: {$lte: Date.now()}},
          { dateEnd: {$gt: Date.now()}}
        ]}}).skip(skip).limit(limit).exec(function (err,users) {

      var promos = [];

      for (var i = users.length - 1; i >= 0; i--) {
        if (users[i].promos) {
          for (var i2 = users[i].promos.length - 1; i2 >= 0; i2--) {
            if (!_.contains(promos, users[i].promos[i2])) {
              promos.push(users[i].promos[i2]);
            }
          }
        }
      }

      if(err) { return handleError(res, err); }
      if(!users) { return res.send(404); }
      return res.json(promos);
    })
  })
}

// Get the latest items visibles to the users
exports.showByCategory = function(req, res) {
  var urlCategory = req.params.category;
  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;

  limit = limit * (page+1);
  skip = page * 8;

  Category.findOne({$or:[{'url.es':urlCategory},{'url.en':urlCategory}]}).exec(function (err, category) {
    if(err) { return handleError(res, err); }
    if(!category) { return res.send(404); };

    Promo.find({$and:[
        {category:{ $in: [category._id]}},
        { dateStart: {$lte: Date.now()}},
        { dateEnd: {$gt: Date.now()}}
      ]}).skip(skip).limit(limit).exec(function (err,search) {
      if(err) { return handleError(res, err); }
      if(!search) { return res.send(404); }
      return res.json(search);
    })
  })
}

// Get the latest items visibles to the users
exports.showByCityAndCategory = function(req, res) {

  var urlCity = req.params.urlCity;
  var urlCategory = req.params.urlCategory;
  var page = parseInt(req.params.page);
  var skip = 0;
  var limit = 8;

  limit = limit * (page+1);
  skip = page * 8;

  City.findOne({url:urlCity}).exec(function (err, city) {
    if(err) { return handleError(res, err); }
    if(!city) { return res.send(404); };
    console.log("city",city);
    Category.findOne({$or:[{'url.es':urlCategory},{'url.en':urlCategory}]}).exec(function (err, category) {
      console.log("category",category);
      User.find({city:city._id}).populate({path:'promos',
        match:{ $and:[
          { category:{ $in: [category._id]}},
          { dateStart: {$lte: Date.now()}},
          { dateEnd: {$gt: Date.now()}}
        ] }})
      .skip(skip).limit(limit).exec(function (err,search) {
        if(err) { return handleError(res, err); }
        if(!search) { return res.send(404); }
        return res.json(search);
      });
    })
  })
}

function handleError(res, err) {
  return res.send(500, err);
}