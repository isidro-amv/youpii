'use strict';

var mongoose = require('mongoose');
var User = require(__dirname + '/../user/user.model.js');
var Schema = mongoose.Schema;

var PackSchema = new Schema({
  name: String,
  // Comapañias dueñas del paquete
  owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  promos:  [{ type: Schema.Types.ObjectId, ref: 'Promo' }],
  quantity: Number,
  price: Number,
  dateRegistered: { type: Date, default: Date.now },
  dateStart: { type: Date, default: Date.now },
  months: Number,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Pack', PackSchema);