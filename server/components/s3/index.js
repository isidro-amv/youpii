module.exports.options = {
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: "AKIAJMP5UGVXEIPEP6DQ",
    secretAccessKey: "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",
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
}

module.exports.bucket = 'youpii';
module.exports.url = 'https://s3.amazonaws.com/';