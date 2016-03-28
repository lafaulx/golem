const amqp = require('amqplib/callback_api');
const bunyan = require('bunyan');

const spawnPhantomRender = require('./lib/spawnPhantomRender');
const uploadImageToS3 = require('./lib/uploadImageToS3');
const config = require('./local_config');

const log = bunyan.createLogger({ name: 'photographer' });

function reply(ch, msg) {
  return function(data) {
    ch.sendToQueue(msg.properties.replyTo,
    new Buffer(JSON.stringify(data)),
    {correlationId: msg.properties.correlationId});

    ch.ack(msg);
  }
}

amqp.connect(config.RABBITMQ_ADDR, function(err, conn) {
  conn.createChannel(function(err, ch) {
    const q = 'pht_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);

    log.info('Awaiting RPC requests');

    ch.consume(q, function(msg) {
      const data = JSON.parse(msg.content.toString());
      const curriedReply = reply(ch, msg);

      log.info(`Received data: ${msg.content.toString()}`);

      spawnPhantomRender(data.html, data.width, data.height, function(err, fileName) {
        if (err) {
          log.error(`Error occured while generating picture: ${err}`);

          curriedReply({ error: err });
          return;
        }

        log.info(`Generated picture: ${fileName}`);

        uploadImageToS3(fileName, function(err, url) {
          if (err) {
            log.error(`Error occured while uploading picture: ${err}`);

            curriedReply({ error: err })
            return;
          }

          log.info(`Uploaded picture: ${url}`);

          curriedReply({ url: url });
        });
      });
    });
  });
});