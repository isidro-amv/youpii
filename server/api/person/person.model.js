'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PersonSchema = new Schema({
  name:               { type: String, trim: true },
  lastname:           { type: String, trim: true },
  second_lastname:    { type: String, trim: true},
  username:           { type: String, trim:true },
  socketSid:          { type: String, default:'' },
  picture:            {
                        name:     String,
                        encoding: String,
                        mimetype: String,
                        extension:String,
                        size:     String ,
                        path:     String,
                        path_o:   String, // original http location
                        path_t:   String, // thumnail http location
                        kind:     String
                      },
  preferences:         [{
    title: { type: String}
  }],
  notification_id:    { type: String },
  password:           { type: String },
  email:              { type: String, required: true, unique: true, trim:true },
  gender:             { type: String },
  birth:              { type: Date },
  history:            [ String ],
  language:           { type: String, default: 'es'},
  wants_notification: { type: Boolean, default: true },
  point:              { type: [Number], index: '2d' },
  current_point:      { type: [Number], index: '2d' },
  first_login:        { type: Date, default: Date.now },
  last_login:         { type: Date, default: Date.now },
  local            : {
      email        : String,
      password     : String,
  },
  facebook         : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  },
  twitter          : {
      id           : String,
      token        : String,
      displayName  : String,
      username     : String
  },
  google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  }
});

module.exports = mongoose.model('Person', PersonSchema);