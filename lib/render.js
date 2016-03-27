const page = require('webpage').create();
const system = require('system');
const path = require('path');
const uuid = require('node-uuid');

const config = require('./local_config');

const args = system.args.slice(1);
const html = args[0];
const width = parseInt(args[1], 10);
const height = parseInt(args[2], 10);

const id = `${uuid.v4()}.png`;

page.viewportSize = { width: width, height : height };
page.content = html;
page.render(path.join(config.TEMP_DIR, id), { quality: 100, format: 'png'});

phantom.exit(id);