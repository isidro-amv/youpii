/**
 * Image sizes
 */
var  config = require('../../config/environment');
var  s3Config = require(config.root+'/server/components/s3/config.js');


module.exports.logo = {
  big:{
    sufix: '-bi',
    width: 450,
    dir: '' },
  normal:{
    sufix: '-no',
    width: 300,
    dir: '' },
  small:{
    sufix: '-sm',
    width: 150,
    dir: '' },
  thumb:{
    sufix: '-th',
    width: 50,
    dir: '' }
};

module.exports.gallery = {
  big:{
    sufix: '-bi',
    width: 800,
    height: 700,
    custom: false,
    dir: '' },
  normal: {
    sufix: '-no',
    width: 550,
    height: 460,
    custom: false,
    dir: '' },
  small: {
    sufix: '-sm',
    width: 340,
    height: 320,
    custom: false,
    dir: ''},
  large: {  //homepage
    sufix: '-la',
    width: 490,
    height: 275,
    custom: true, // las medidas serán exactamente como se suba
    dir: '' },
  slim:{   //homepage
    sufix: '-sl',
    width: 260,
    height: 280,
    custom: true, // las medidas serán exactamente como se suba
    dir: ''
  }
}

module.exports.largeSlider = {
  normal:{
    sufix:'-no',
    width: 1920,
    custom: false,
    height: 360
  },
  small:{
    sufix: '-sm',
    width: 1000,
    custom: false,
    height: 360
  }
}
module.exports.mobileSlider = {
  normal:{
    sufix:'-no',
    width: 460,
    custom: false,
    height: 360
  }
}



module.exports.setSizePaths = function (images,type) {
  var isArray = true;
  if (!(images instanceof Array)) {
    images = [images];
    isArray = false;
  }
  for (var i = images.length - 1; i >= 0; i--) {
    images[i].paths = {};
    // Todo esto se puede hacer con arrays
    if (type==='logo') {
      images[i].paths.big = this.generateS3Url(images[i].name,this.logo.big.sufix);
      images[i].paths.normal = this.generateS3Url(images[i].name,this.logo.normal.sufix);
      images[i].paths.small = this.generateS3Url(images[i].name,this.logo.small.sufix);
      images[i].paths.thumb = this.generateS3Url(images[i].name,this.logo.thumb.sufix);
    }
    if (type==='gallery') {
      images[i].paths.big = this.generateS3Url(images[i].name,this.gallery.big.sufix);
      images[i].paths.normal = this.generateS3Url(images[i].name,this.gallery.normal.sufix);
      images[i].paths.small = this.generateS3Url(images[i].name,this.gallery.small.sufix);
      images[i].paths.large = this.generateS3Url(images[i].name,this.gallery.large.sufix);
    }
    if (type==='largeSlider') {
      images[i].paths.normal = this.generateS3Url(images[i].name,this.largeSlider.normal.sufix);
      images[i].paths.small = this.generateS3Url(images[i].name,this.largeSlider.small.sufix);
    }
    if (type==='mobileSlider') {
      images[i].paths.normal = this.generateS3Url(images[i].name,this.mobileSlider.normal.sufix);
    }
  }
  return (isArray ? images : images[0]);
}

module.exports.addSufixText = function (str,sufix) {
  var splitName = str.split('.');
  splitName[splitName.length-2] = splitName[splitName.length-2]+sufix;
  return splitName.join('.');
};

module.exports.generateS3Url = function (name,sufix) {
    return s3Config.url+s3Config.bucket+'/'+ this.addSufixText(name, sufix);
}
