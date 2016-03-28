const amqp = require('amqplib/callback_api');
const bunyan = require('bunyan');

const spawnPhantomRender = require('./lib/spawnPhantomRender');
const uploadImageToS3 = require('./lib/uploadImageToS3');
const config = require('./local_config');

var log = bunyan.createLogger({ name: 'glm_server' });

amqp.connect(config.RABBITMQ_ADDR, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'glm_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);

    log.info('Awaiting RPC requests');

    ch.consume(q, function reply(msg) {
      var data = JSON.parse(msg.content.toString());

      log.info(`Received data: ${msg.content.toString()}`);

      spawnPhantomRender(data.html, data.width, data.height, function(err, fileName) {
        if (err) {
          log.error(`Error occured while generating picture: ${err}`);

          ch.sendToQueue(msg.properties.replyTo,
            new Buffer(JSON.stringify({ error: err })),
            {correlationId: msg.properties.correlationId});

          ch.ack(msg);

          return;
        }

        log.info(`Generated picture: ${fileName}`);

        uploadImageToS3(fileName, function(err, url) {
          if (err) {
            log.error(`Error occured while uploading picture: ${err}`);

            ch.sendToQueue(msg.properties.replyTo,
              new Buffer(JSON.stringify({ error: err })),
              {correlationId: msg.properties.correlationId});

            ch.ack(msg);

            return;
          }

          log.info(`Uploaded picture: ${url}`);

          ch.sendToQueue(msg.properties.replyTo,
            new Buffer(JSON.stringify({ url: url })),
            {correlationId: msg.properties.correlationId});

          ch.ack(msg);
        });
      });
    });
  });
});