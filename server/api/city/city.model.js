'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CitySchema = new Schema({
  name: String,
  state: String,
  url: String,
  loc: {type: [Number], index: '2d'},
  info: String,
  active: Boolean
});

module.exports = mongoose.model('City', CitySchema);