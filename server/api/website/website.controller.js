'use strict';

var _ = require('lodash');
var Website = require('./website.model');
var config = require('../../config/environment');
var Promo = require(config.root+'/server/api/promo/promo.model');
var s3 = require(config.root+'/server/components/s3');

// Get list of websites
exports.index = function(req, res) {
  Website.find(function (err, websites) {
    if(err) { return handleError(res, err); }
    return res.json(200, websites[0]);
  });
};

// Get a single website - pero no es requerido para este proyecto
exports.show = function(req, res) {
  Website.findById(req.params.id, function (err, website) {
    if(err) { return handleError(res, err); }
    if(!website) { return res.send(404); }
    if (website.sections) {
      website.sections = _.sortBy(website.sections,'order');
      if (website.sections.blocks) {
        website.sections.blocks = _.sortBy(website.sections.blocks,'order');
      }
    }
    return res.json(website);
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

  Website.findOne( function (err, website) {
    if (err) { return handleError(res, err); }
    if(!website) { return res.send(404); }

    var indexS = website.getSectionIndexBy({section:'sections',id:id});
    if(indexS === false) {
      console.log("Section not found");
      return res.send(404);
    }

    website.sections[indexS] = _.merge(website.sections[indexS], req.body);
    website.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, website);
    });
  });
};

// Deletes a website from the DB.
exports.destroySection = function(req, res) {
  console.log("Update Section", req.params);
  console.log("body",req.body);
  console.log("Files",req.files);

  var id = req.params.sectionId;


  Website.findOne(function (err, website) {
    if(err) { return handleError(res, err); }
    if(!website) { return res.send(404); }

    var indexS = website.getSectionIndexBy({section:'sections',id:id});
    var deleted = website.sections.splice(indexS,1);

    console.log("index deleted->",deleted);
    console.log(website.sections[indexS]);
    website.save(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


// Creates a new website in the DB.
exports.createBlock = function(req, res) {
  console.log("Create Section Block",req.params);
  console.log("body",req.body);
  console.log("Files",req.files);
  var sectionId = req.params.sectionId;
  var processBlock = function (promo) {
    Website.findOne(function (err, website) {
      if(err) { return handleError(res, err); }
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
  var updateFunc = function (website, indexS, indexB, info) {
    var block = website.sections[indexS].blocks[indexB];
    console.log("saved");
    console.log(website.sections[indexS].blocks[indexB]);
    website.sections[indexS].blocks[indexB] = _.merge(block, req.body);
    website.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, website);
    });
  }

  var sectionId = req.params.sectionId;
  var blockId = req.params.blockId;

  Website.findOne( function (err, website) {
    var indexS, indexB, block;
    if (err) { return handleError(res, err); }
    if(!website) { return res.send(404); }

    indexS = website.getSectionIndexBy({section:'sections',id:sectionId});
    if(indexS === false ) {
      console.log("Section not found");
      return res.send(404);
    }
    indexB = website.getBlockIndex({id:blockId,sectionIndex:indexS});
    if(indexB === false ) {
      console.log("Section not found");
      return res.send(404);
    }
    block = website.sections[indexS].blocks[indexB];

    console.log("indexB",indexB);
    console.log("indexS",indexS);
    if(req.body._id) { delete req.body._id; }
    if (req.body.kind === 'promo') {
      // si el block era 'generic' eliminar imágenes
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
        updateFunc(website, indexS, indexB, req.body);
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
          req.files.image.paths.large = s3.oneUploadFile(
            req.files.imageLargeCrop,{kind:'gallery',size:'large'}
          );
        }
        delete req.body.image.path;
      }
      updateFunc(website, indexS, indexB, req.body);
    }
  });

};


// Deletes a website from the DB.
exports.destroyBlock = function(req, res) {
  console.log("destroy section block",req.params);
  var sectionId = req.params.sectionId;
  var blockId = req.params.blockId;


  Website.findOne(function (err, website) {
    if(err) { return handleError(res, err); }
    if(!website) { return res.send(404); }

    var indexS = website.getSectionIndexBy({section:'sections',id:sectionId});
    var indexB = website.getBlockIndex({id:blockId,sectionIndex:indexS})
    var block = website.sections[indexS].blocks[indexB];
    var deleted = website.sections[indexS].blocks.splice(indexB,1);
    if (block.kind === 'generic') {
      s3.deleteFiles(block.image);
    }

    console.log("index deleted->",deleted);
    console.log(website.sections[indexS].blocks[indexB]);
    website.save(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}