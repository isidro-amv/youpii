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
  // cantidad de meses comprados
  months: Number,
  // una breve descripción
  info: String,
  active: Boolean
});

/**
 * Methods
 */
PackSchema.methods = {
  /**
   * availablePromos - checks the amount of available promotions
   *
   * @return {Number}
   * @api public
   */
  availablePromos: function() {
    var availablePromos = this.quantity - promos.length;
    return availablePromos;
  }
}

module.exports = mongoose.model('Pack', PackSchema);