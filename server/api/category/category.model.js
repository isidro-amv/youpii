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
  parent: Array,
  info:{
    es: String,
    en: String
  },
  active: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);