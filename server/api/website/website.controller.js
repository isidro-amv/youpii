'use strict';

var _ = require('lodash');
var Website = require('./website.model');
var config = require('../../config/environment');
var Promo = require(config.root+'/server/api/promo/promo.model');
var s3 = require(config.root+'/server/components/s3');

// Get list of websites
exports.index = function(req, res) {
  console.log("here is my website");
  Website.findOne({},function (err, website) {
    if(err) { return handleError(res, err); }

    if (website.sections) {
      website.sections = _.sortBy(website.sections,'order');
      for (var i = website.sections.length - 1; i >= 0; i--) {
        if (website.sections[i].blocks) {
          website.sections[i].blocks = _.sortBy(website.sections[i].blocks,'order');
        };
      }
    }
    if (website.sliders) {
      website.sliders = _.sortBy(website.sliders,'order');
    }

    return res.json(200, website);
  });
};

// Creates a new website in the DB.
exports.createSlider = function(req, res) {
  console.log("Files",req.files);

  if (req.files) {
    if (req.files.mainimage) {
      req.files.mainimage = s3.uploadFile(req.files.mainimage,'largeSlider');
      req.files.mainimage.desc = req.body.desc;
      delete req.files.mainimage.path;
    }
    if (req.files.image) {
      req.files.image = s3.uploadFile(req.files.image,'mobileSlider');
      req.files.image.desc = req.body.desc;
      delete req.files.image.path;
    }
  }

  if(req.body._id) { delete req.body._id; }

  Website.findOne(function (err, website) {
    if (err) { return handleError(res, err); }
    if(!website) { return res.send(404); }
    console.log("files->", req.files);
    var indexS = website.sliders.push(req.body) - 1 ;
    website.sliders[indexS].images = req.files;
    console.log("files1->",  website.sliders[indexS].images);
    website.save(function (err,website) {
      console.log("files2->",  website.sliders[indexS].images);
      if (err) { return handleError(res, err); }
      return res.json(200, website);
    });
  });
};

// Updates an existing website in the DB.
exports.updateSlider = function(req, res) {
  // hay una sospecha de los updates de array no funcionan
  console.log("Update Slider", req.params);
  console.log("body",req.body);
  console.log("Files",req.files);

  if(req.body._id) { delete req.body._id; }
  var id = req.params.sliderId;

  Website.findOne(function (err, website) {

    var indexS = website.getSectionIndexBy({section:'sliders',id:id});
    if(indexS === false) { return res.send(404); }

    if (req.files) {
      if (req.files.mainimage) {
        s3.deleteFiles(website.sliders[indexS].images.mainimage);
        req.files.mainimage.desc = req.body.desc;
        website.sliders[indexS].images.mainimage = req.files.mainimage;
      }
      if (req.files.image) {
        s3.deleteFiles(website.sliders[indexS].images.image);
        req.files.image.desc = req.body.desc;
        website.sliders[indexS].images.image = req.files.image;
      }

      req.body.images = req.files;
      console.log("body update",req.body);
    }

    if (err) { return handleError(res, err); }
    if(!website) { return res.send(404); }
    website.sliders[indexS] = _.merge(website.sliders[indexS], req.body);
    website.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, website);
    });
  });
};

// Deletes a website from the DB.
exports.destroySlider = function(req, res) {
  console.log("destroy slider",req.params);
  var id = req.params.sliderId;


  Website.findOne(function (err, website) {
    if(err) { return handleError(res, err); }
    if(!website) { return res.send(404); }

    var indexS = website.getSectionIndexBy({section:'sliders',id:id});

    // eliminar imágenes de S3
    if (website.sliders[indexS].images.mainimage) {
      s3.deleteFiles(website.sliders[indexS].images.mainimage);
    }
    if (website.sliders[indexS].images.image) {
      s3.deleteFiles(website.sliders[indexS].images.image);
    }

    var deleted = website.sliders.splice(indexS,1);

    console.log("index deleted->",deleted);

    console.log(website.sliders[indexS]);
    website.save(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


// Creates a new website in the DB.
exports.createSection = function(req, res) {
  console.log("Create Section");
  console.log("body",req.body);
  console.log("Files",req.files);
  Website.findOne(function (err, website) {
    if(err) { return handleError(res, err); }
    website.sections.push(req.body);
    console.log(website.sections);
    website.save(function (err,website) {
      if (err) { return handleError(res, err); }
      return res.json(200, website);
    });
  });
};

// Updates an existing website in the DB.
exports.updateSection = function(req, res) {
  // hay una sospecha de los updates de array no funcionan
  console.log("Update Section", req.params);
  console.log("body",req.body);
  console.log("Files",req.files);

  if(req.body._id) { delete req.body._id; }
  var id = req.params.sectionId;

  Website.update({"sections._id" : id },
    {"$set" :{
      "sections.$.title" : req.body.title,
      "sections.$.url" : req.body.url,
      "sections.$.order" : req.body.order
    }},
    function (err, numberAffected, raw) {
      if (err) return handleError(err);
      console.log('The number of updated documents was %d', numberAffected);
      console.log('The raw response from Mongo was ', raw);
      return res.json(200, raw);
  });
};

// Deletes a website from the DB.
exports.destroySection = function(req, res) {
  console.log("Destroy Section", req.params);
  console.log("body",req.body);
  console.log("Files",req.files);

  var id = req.params.sectionId;


  Website.update(
    { },
    { $pull: { sections : { _id : id } } },
    { safe: true },
    function (err, website) {
      console.log(err);
      console.log(website);
      console.log("succes");
      res.send(200);
  });
};


// Creates a new website in the DB.
exports.createBlock = function(req, res) {
  console.log("Create Section Block --",req.params);
  console.log("body",req.body);
  console.log("Files",req.files);
  var sectionId = req.params.sectionId;
  var processBlock = function (promo) {
    Website.findOne(function (err, website) {
      if(err) { return handleError(res, err); }
      if(!website) { return res.send(404); }

      console.log('section',website);
      var indexS = website.getSectionIndexBy({section:'sections',id:sectionId});

      if(indexS === false) {
        console.log("Section not found");
        return res.send(404);
      }

      website.sections[indexS].blocks.push(req.body);
      website.save(function (err,website) {
        if (err) { return handleError(res, err); }
        return res.json(200, website.getBlocks(indexS));
      });
    });
  };

  if (req.body.kind === 'promo') {
    Promo.findById(req.body.promo_id, function (err, promo) {
      if (err) { return handleError(res, err); }
      if(!promo) {
        console.log("No se ha encontrado una promoción");
        return res.send(404);
      }
      processBlock(promo);
    });
  }

  if (req.body.kind === 'generic') {
    if (req.files && req.files.image) {
      req.files.image = s3.uploadFile(req.files.image,'gallery');
      req.files.image.desc = req.body.title || '';
      if (req.files.imagemainCrop) {
        req.files.image.paths.slim = s3.oneUploadFile(
          req.files.imagemainCrop,{kind:'gallery',size:'slim'}
        );
      }
      if (req.files.imageLargeCrop) {
        req.files.image.paths.large = s3.oneUploadFile(
          req.files.imageLargeCrop,{kind:'gallery',size:'large'}
        );
      }
      delete req.files.image.path;
      req.body.image = req.files.image;
    }
    processBlock();
  }
}

// Updates an existing website in the DB.
exports.updateBlock = function(req, res) {
  // hay una sospecha de los updates de array no funcionan
  console.log("Update Section Block", req.params);
  console.log("body",req.body);
  console.log("Files",req.files);
  var sectionId = req.params.sectionId;
  var blockId = req.params.blockId;

  Website.findOne( function (err, website) {
    var indexS, indexB, block;
    console.log('blockId',blockId);
    if (err) { return handleError(res, err); }
    if(!website) { return res.send(404); }
    if(req.body._id) { delete req.body._id; }

    // busca un bloque por id
    for (var i = website.sections.length - 1; i >= 0; i--) {
      for (var i2 = website.sections[i].blocks.length - 1; i2 >= 0; i2--) {
        if (website.sections[i].blocks[i2]._id == blockId) {
          block = website.sections[i].blocks[i2];
          indexS = i;
          indexB = i2;
        }
      }
    }
    if (!block) {
      return res.send(404,{
        error: "No existe Id de promoción"
      });
    }

    console.log('block',block);
    if (req.body.kind === 'promo') {
      if (block.kind === 'generic') {
        s3.deleteFiles(block.image);
      }
      Promo.findById(req.body.promo_id, function (err, promo) {
        if (err) { return handleError(res, err); }
        if (!promo) {
          console.log("No se ha encontrado una promoción");
          return res.send(404,{
            error: "No existe Id de promoción"
          });
        }

        console.log('block-bef',website.sections[indexS].blocks[indexB]);
        website.sections[indexS].blocks[indexB] = _.merge(website.sections[indexS].blocks[indexB], req.body);
        console.log('block-aft',website.sections[indexS].blocks[indexB]);
        website.save(function (err,website) {
          if (err) { return handleError(res, err); }
          return res.json(200);
        });
      });
    }
    if (req.body.kind === 'generic') {
      if (req.files && req.files.image) {
        s3.deleteFiles(block.image);
        req.body.image = s3.uploadFile(req.files.image,'gallery');
        req.body.image.desc = req.body.title || '';
        if (req.files.imagemainCrop) {
          req.body.image.paths.slim = s3.oneUploadFile(
            req.files.imagemainCrop,{kind:'gallery',size:'slim'}
          );
        }
        if (req.files.imageLargeCrop) {
          req.body.image.paths.large = s3.oneUploadFile(
            req.files.imageLargeCrop,{kind:'gallery',size:'large'}
          );
        }
        delete req.body.image.path;
      }
      website.sections[indexS].blocks[indexB] = _.merge(website.sections[indexS].blocks[indexB], req.body);
      website.save(function (err,website) {
        if (err) { return handleError(res, err); }
        return res.json(200);
      });
    }
  });
};

// Deletes a website from the DB.
exports.destroyBlock = function(req, res) {
  console.log("Destroy section block",req.params);
  var sectionId = req.params.sectionId;
  var blockId = req.params.blockId;


  Website.findOne(function (err, website) {
    if(err) { return handleError(res, err); }
    if(!website) { return res.send(404); }

    var blockDeleted;

     // busca un bloque por id
    for (var i = website.sections.length - 1; i >= 0; i--) {
      for (var i2 = website.sections[i].blocks.length - 1; i2 >= 0; i2--) {
        if (website.sections[i].blocks[i2]._id == blockId) {

          blockDeleted = website.sections[i].blocks[i2];

          console.log("index deleted->", blockDeleted);
          console.log("image index deleted->", blockDeleted.image);
          console.log(website.sections[i].blocks[i2]);


          if (blockDeleted.kind === 'generic') {
            s3.deleteFiles(blockDeleted.image);
          }
          website.sections[i].blocks.splice(i2,1);

        }
      }
    }

    website.save(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });

};

function handleError(res, err) {
  return res.send(500, err);
}