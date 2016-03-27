const amqp = require('amqplib/callback_api');
const bunyan = require('bunyan');

const spawnPhantomRender = require('./lib/spawnPhantomRender')
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

      spawnPhantomRender(data.html, data.width, data.height, function(err, id) {
        var response = {};

        if (err) {
          log.error(err);
          response.error = err;
        }

        if (id) {
          log.info(`Generated picture: ${id}`);
          response.id = id;
        }

        ch.sendToQueue(msg.properties.replyTo,
          new Buffer(JSON.stringify(response)),
          {correlationId: msg.properties.correlationId});

        ch.ack(msg);
      })
    });
  });
});