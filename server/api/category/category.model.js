'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name:{
    es: String,
    en: String
  },
  leve: Number,
  parent: Array,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);