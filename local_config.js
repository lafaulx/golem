const path = require('path');

module.exports = {
  RABBITMQ_ADDR: 'amqp://localhost',
  TEMP_DIR: path.join(__dirname, 'temp')
};
