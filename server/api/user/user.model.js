'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  name: { type:String, required: true, unique: true },
  url: { type:String, required: true, unique: true },
  businessName: { type:String, required: true, unique: true },
  genericId: { type: String, required: true, unique: true},
  contact:{
    name: String,
    tel: [String]
  },
  description:{
    en: String,
    es: String
  },
  info:{
    en: String,
    es: String
  },
  tel: [String],
  cel: [String],
  dir: {
    en: String,
    es: String
  },
  hours: {
    en: String,
    es: String
  },
  loc: { type: Number, required: false },
  coords: {type: [Number], index: '2d', required: true},
  city: { type: Schema.Types.ObjectId, ref: 'City' },
  logo:{
    name:     String,
    desc:{
      en: String,
      es: String
    },
    paths :{
      big:    String,
      normal: String,
      small:  String,
      thumb:  String
    },
    kind:     String  },
  images:[{
    _id:      Schema.Types.ObjectId,
    name:     String,
    desc:{
      en: String,
      es: String
    },
    paths:{
      big: String,
      large: String,
      normal: String,
      small: String,
      slim: String // personalizada
    },
    kind:     String  }],
  dateCreate: { type: Date, default: Date.now },
  email: { type: String, lowercase: true },
  visibleEmail : {type: Boolean, default: false},
  role: {
    type: String,
    default: 'user'
  },
  urlWebsite: String,
  social:{
    whatsapp: String,
    facebook: String,
    twitter: String,
    youtube: String,
    pinterest: String,
    instagram: String,
    yelp: String,
    foursquare: String,
    tripadvisor: String
  },
  promos: [{ type: Schema.Types.ObjectId, ref: 'Promo', unique:true }],
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  github: {}
});

UserSchema.index({ coords: '2d' });

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {

    var hours = {};

    if (typeof this.hours === "string") {
      hours.es = this.hours;
      hours.en = '';
    }else{
      hours = this.hours
    }

    return {
      '_id': this._id,
      'name': this.name,
      'url': this.url,
      'businessName': this.businessName,
      'contact':{
        'name': this.contact.name,
        'tel': this.contact.tel
      },
      'genericId': this.genericId,
      'description':{
        'en': this.description.en,
        'es': this.description.es
      },
      'info':{
        'en': this.info.en,
        'es': this.info.es
      },
      'dir':{
        'en': this.dir.en,
        'es': this.dir.es
      },
      'hours':hours,
      'tel': this.tel,
      'cel': this.cel,
      'coords': this.coords,
      'city': this.city,
      'logo': this.logo,
      'images': this.images,
      'dateCreate': this.dateCreate,
      'email': this.email,
      'role': this.role,
      'urlWebsite': this.urlWebsite,
      'loc': this.loc,
      'visibleEmail': this.visibleEmail,
      'social': {
        'whatsapp': this.social.whatsapp,
        'facebook': this.social.facebook,
        'twitter': this.social.twitter,
        'youtube': this.social.youtube,
        'pinterest': this.social.pinterest,
        'instagram': this.social.instagram,
        'yelp': this.social.yelp,
        'tripadvisor': this.social.tripadvisor,
        'foursquare': this.social.foursquare
      }
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
