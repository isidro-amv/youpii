var s3 = require('s3');
var config = require('./config.js');
var images = require('../images');
var clientS3 =  s3.createClient(config.options);
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var uploadFile = function (file,name,cb) {
var uploader = clientS3.uploadFile({
    localFile: file,
    s3Params: {
      ACL: 'public-read',
      Bucket: config.bucket,
      Key: name
    },
  });
  uploader.on('end', function(err) {
    console.log("done uploading",err);
    if (cb) cb();
  });
};

module.exports.uploadFile = function (files, type, cb) {
  var format;
  var isArray = true;

  // si no encuentra el tipo dentro del formato de imagenes debería retornar los archivos
  if (type === 'gallery'){
    format = images.gallery;
  } else if (type==='logo') {
    format = images.logo;
  }else if(type==='largeSlider'){
    format = images.largeSlider;
  }else if(type==='mobileSlider'){
    format = images.mobileSlider;
  }else{
    console.log('no se ha especificado tipo de imagen');
    return files;
  }

  if ( !(files instanceof Array) ) {
    files = [files]
    isArray = false;
  }

  files = images.setSizePaths(files,type);

  files.forEach(function (file, k) {
    Object.keys(format).forEach(function( el, i){
      // no subas imagen  si es tipo personalizada
      if (format[el].custom) return;

      var pathVariation = images.addSufixText(files[k].path, format[el].sufix);
      gm(files[k].path)
      .resize(format[el].width,format[el].width,'^')
      .gravity('Center')
      .crop(format[el].width,format[el].width)
      .write(pathVariation, function (err) {
        if (!err) {
          uploadFile(pathVariation,pathVariation.split('/').slice(-1)[0],cb);
        }else{
          console.log(err);
        }
      });
    });
  });

  return (isArray ? files : files[0]);
}

module.exports.oneUploadFile = function (file, obj,cb) {

  if (!obj) {
    return ;
  }else{
    if (!obj.kind) { return; }
    if (!obj.size) { return; }
  }
  if (!file) { return; }

  var kind = obj.kind;
  var size = obj.size;
  var sufix = images[kind][size].sufix;
  var path = images.generateS3Url(file.name,sufix);
  uploadFile(file.path,path.split('/').slice(-1)[0],cb);
  return path;
}

module.exports.deleteFiles = function (images,name,cb) {

  var objects = [], isArray= true;

  if ( !(images instanceof Array) ) {
    images = [images]
    isArray = false;
  }

  for (var i = images.length - 1; i >= 0; i--) {
    // por alguna razon json de mongoose no se puden hacer foreach
    // el siguiente código convierte json a string y los regresa a su forma original
    console.log("to delete s3->", images[i]);
    if (!images[i].paths) {
      continue;
    }
    images[i].paths = JSON.parse(JSON.stringify(images[i].paths));
    for(var k in images[i].paths){
      if( typeof images[i].paths[k] === 'string'  ){
        console.log('deleted-->',images[i].paths[k]);
        name = images[i].paths[k].split('/').slice(-1)[0];
        images[i].paths[k] = '';
        objects.push({Key: name});
      }
    }
  }
  if (objects.length > 0) {
    var uploader = clientS3.deleteObjects({
      Bucket: config.bucket,
      Delete: {
        Objects:objects
      }
    },function (err,data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
      if (cb) cb(err,data);
    });
  }

  return (isArray ? images : images[0]);
}
