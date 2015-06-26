'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Category = require(__dirname + '/../category/category.model.js'),
    User = require(__dirname + '/../user/user.model.js'),
    Pack = require(__dirname + '/../pack/pack.model.js'),
    textSearch = require('mongoose-text-search');

var PromoSchema = new Schema({
  title: {
    en: String,
    es: String
  },
  promo: {
    en: String,
    es: String
  },
  // estilo que tendrá la promoción
  promoStyle:{
    en: String,
    es: String
  },
  // tipo de promocion
  promoKind: {type: String, enum: [
    '',  // tomará el estilo inline si el tipo de promoción está vacio
    'desc', // descuentos tipo: 15% - 50% - 70%
    'only', // precios: Sólo $25, Sólo 300
    'free', // gratis
    'best', // mejor precio
    'nxn', // 3x1 2x1
    'nxn-2', // 2x2x1½
    'from',  // Desde 2 pesos
    'freeship' // Envío gratis
  ]},
  description:{
    en: String,
    es: String
  },
  restriction:{
    en: String,
    es: String
  },
  url:{
    en: String,
    es: String
  },
  fullTitle:{
    en: String,
    es: String
  },
  imagemain:{
    name:     String,
    desc: {
      en: String,
      es: String
    },
    paths:{
      big: String,
      large: String,
      normal: String,
      small: String,
      slim: String
    },
    kind:     String  },
  images:[{
    _id:      Schema.Types.ObjectId,
    name:     String,
    desc:     {
      en: String,
      es: String
    },
    paths:{
      big: String,
      large: String,
      normal: String,
      small: String
    },
    kind:     String  }],
  price: Number,
  dateRegistered: { type: Date, default: Date.now },
  // el tiempo que que la promoción durará (válido hasta enero, agotar existencias, marzo a abril)
  dateLimit: {
    en: String,
    es: String
  },
  // fecha en que la promocion debe de mostrase al usuario
  dateStart: { type: Date, default: Date.now },
  // fecha en que la que la promción no se mostrará al usuario
  dateEnd: { type: Date },
  likes: {
    // veces que se ha visitado la promoción
    visited: { type:Number, default: 0},
    // veces que se le ha dado like
    liked: { type:Number, default: 0},
    // relación entre likes y visited
    average: { type:Number, default: 0}
  },
  tags: {
    en: [String],
    es: [String]
  },
  isPremium: Boolean,
  code: String,
  homeDelivery: Boolean,
  pack: { type: String, required:false },
  category:  [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, enum: ['MXN','USD'], default: 'MXN' },
  active: Boolean
});

// add a text index to the tags array
PromoSchema.index({ 'tags.es': 'text','tags.en': 'text'});

// agrega a el id de promoción al listado de promociones del cliente
PromoSchema.post('save', function (promo) {
  //TODO: testear si esto funciona
  promo.average = (promo.visited + promo.liked)/2;

  User.findByIdAndUpdate(
    promo.owner,
    {$push: {promos: promo._id}},
    {safe: true, upsert: true},
    function(err, model) {
      if (err) { console.log("error en presave promo",err) }
    }
  );

  Pack.findByIdAndUpdate(
    promo.pack,
    {$push: {promos: promo._id}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log("error en presave promo with pack",err);
    }
  );

});

// elimina a el id de promoción al listado de promociones del cliente
PromoSchema.post('remove', function (promo) {
  User.findByIdAndUpdate(
    promo.owner,
    {$pull: {promos: promo._id}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log("error en presave promo",err);
    }
  );
})

// Non-sensitive info we'll be putting in the token
PromoSchema
  .virtual('valid')
  .get(function() {
    var now = Date.now();
    return this.dateStart < now && this.dateEnd > now;
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