'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name:{
    es: String,
    en: String
  },
  url: {
    es: String,
    en: String
  },
  iconClass: String,
  parent: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  info:{
    es: String,
    en: String
  },
  active: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);