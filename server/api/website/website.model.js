'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    config = require('../../config/environment'),
    Promo = require(config.root+'/server/api/promo/promo.model');

var WebsiteSchema = new Schema({
  title: String,
  sliders: [{
    _id: { type: Schema.Types.ObjectId , default: new mongoose.Types.ObjectId()},
    title: {
      en: String,
      es: String
    },
    order: Number,
    images: Schema.Types.Mixed // Type:image [mainimage, image]
  }],
  sections:[{
    _id: { type: Schema.Types.ObjectId , default: new mongoose.Types.ObjectId()},
    order: Number,
    title:{
      en: String,
      es: String
    },
    url:{
      en: String,
      es: String
    },
    blocks:[{
      _id: { type: Schema.Types.ObjectId , default: new mongoose.Types.ObjectId()},
      promo_id: { type: Schema.Types.ObjectId, ref: 'Promo' },
      order: Number,
      title:{
        en: String,
        es: String
      },
      promo:{
        en: String,
        es: String
      },
      promoStyle:{
        en: String,
        es: String,
      },
      url:{
        en: String,
        es: String
      },
      image:{
        name: String,
        desc:{
          en: String,
          es: String
        },
        paths:{
          big: String,
          large: String,
          normal: String,
          small: String,
          slim: String
        }
      },
      kind: { type:String , enum: ['promo', 'generic'] },
      dimension: { type:String , enum: ['large', 'mobile']}
    }]
  }],
  active: Boolean
});

WebsiteSchema.methods = {

  getSectionIndexBy: function (obj) {
    var id = obj.id;
    var section = obj.section;

    for (var i = 0; i < this[section].length; i++) {
      console.log(this[section][i]._id+" is equals to"+id+"?");
      if (this[section][i]._id.equals(id)) {
        return i;
      }
    }
    return false;
  },
  getBlockIndex: function (obj) {
    var blockId = obj.id;
    var sectionIndex = obj.sectionIndex;
    var blocks = this.sections[sectionIndex].blocks;

    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i]._id.equals(blockId)) {
        return i;
      }
    }
    return false;
  },
  getBlocks: function (sectionIndex) {
    var blocks = [];
    blocks = this.sections[sectionIndex].blocks;
    for (var i = 0; i < blocks.length; i++) {
      blocks[i] = this.getBlock(sectionIndex,i);
    }
    return blocks;
  },
  getBlock: function (sectionIndex, blockIndex) {
    var block = this.sections[sectionIndex].blocks[blockIndex];

    if (block.kind === 'promo') {
      Promo.findById(block.promo_id, function (err, promo) {
        if (err) { return false }
        if(!promo) {
          console.log("No se ha encontrado una promoción");
          return false;
        }
        block.promo = promo.promo;
        block.url = promo.url;
        block.image = promo.imagemain
        return block;
      });
    } else if(block.kind === 'generic'){
      return block;
    } else{
      console.log("block kind is not defined ->", block.kind);
      return;
    }

  }

}


module.exports = mongoose.model('Website', WebsiteSchema);