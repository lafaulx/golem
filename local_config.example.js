const path = require('path');

module.exports = {
  RABBITMQ_ADDR: 'amqp://localhost',

  S3_ACCESS_KEY: 'S3_ACCESS_KEY',
  S3_SECRET_KEY: 'S3_SECRET_KEY',
  S3_BUCKET: 'S3_BUCKET',
  S3_REGION: 'S3_REGION',

  TEMP_DIR: path.join(__dirname, 'temp')
};
