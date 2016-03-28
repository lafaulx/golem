const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');

const config = require('../local_config');

aws.config.update({
  accessKeyId: config.S3_ACCESS_KEY,
  secretAccessKey: config.S3_SECRET_KEY,
  region: config.S3_REGION
});

const s3 = new aws.S3({signatureVersion: 'v4'});

function uploadImageToS3(fileName, cb) {
  const fileBuffer = fs.readFileSync(path.join(config.TEMP_DIR, fileName));

  s3.putObject({
    ACL: 'public-read',
    Bucket: config.S3_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: 'image/png'
  }, function(err) {
    if (err) {
      cb && cb(err);
      return;
    }

    cb && cb(null, 'https://' + config.S3_BUCKET + '.s3.amazonaws.com/' + fileName)
  });
}

module.exports = uploadImageToS3;