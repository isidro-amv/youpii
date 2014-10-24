'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WebsiteSchema = new Schema({
  title: String,
  slider: [{
    title: {
      language: String,
      quote: String,
      translation:[{
        language: String,
        quote: String,
      }]
    },
    images:[{
      language: String,
      name:     String,
      encoding: String,
      mimetype: String,
      extension:String,
      size:     String ,
      path:     String,
      pathLarge:   String, // original - Large
      pathNormal:   String, // size for tablet portrait
      pathMobile:   String, // Size for mobile
      kind:     String
    }]
  }],
  section:[{
    title:{
      language: String,
      quote: String,
      translation:[{
        language: String,
        quote: String
      }]
    },
    block:[{
      title:{
        language: String,
        quote: String,
        translation:[{
          language: String,
          quote: String
        }]
      },
      image:{
        language: String,
        name:     String,
        encoding: String,
        mimetype: String,
        extension:String,
        size:     String ,
        path:     String,
        pathLarge:   String, // original - Large
        pathNormal:   String, // size for tablet portrait
        pathMobile:   String, // Size for mobile
        kind:     String
      }
    }]
  }],
  active: Boolean
});

module.exports = mongoose.model('Website', WebsiteSchema);