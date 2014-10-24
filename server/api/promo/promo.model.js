'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Category = require(__dirname + '/../category/category.model.js'),
    User = require(__dirname + '/../user/user.model.js');

/**
 * Functions
 */
var promoFuncts = {
  setLimitTime: function () {
    var x = 12; //or whatever offset
    var currentDate = new Date(); // new Date
    return currentDate.setMonth(currentDate.getMonth() + x);
  }
}

var PromoSchema = new Schema({
  title: {
    en: String,
    es: String
  },
  promo: {
    en: String,
    es: String
  },
  description:{
    en: String,
    es: String
  },
  image:[{
    name:     String,
    encoding: String,
    mimetype: String,
    extension:String,
    size:     String ,
    path:     String,
    pathOriginal:   String, // original http location
    pathNormal:   String, // normal http location
    pathLarge:   String, // Large http location
    kind:     String  }],
  price: Number,
  dateRegistered: { type: Date, default: Date.now },
  dateRenews: [ Date ],
  dateLimit: { type: Date, default: promoFuncts.setLimitTime },
  dateStart: { type: Date, default: Date.now },
  dateEnd: { type: Date },
  countLikes: { type: Number },
  recordLikes : [ String ],
  category:  { type: Schema.Types.ObjectId, ref: 'Category' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  currency: { type: String, enum: ['MXN','USD'], default: 'MXN' },
  active: Boolean
});


/**
 * Virtuals
 */

PromoSchema
  .virtual('renew')
  .set(function() {
    var x = 12; //or whatever offset
    var currentDate = new Date(); // new Date
    var limitDate   = currentDate.setMonth(currentDate.getMonth() + x);

    this.dateLimit = limitDate;
    this.dateRenews.push(currentDate);
  })
  .get(function() {
    return this.dateRenews.slice(-1).pop();
  });

module.exports = mongoose.model('Promo', PromoSchema);