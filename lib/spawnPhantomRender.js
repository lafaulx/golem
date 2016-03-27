const path = require('path')
const childProcess = require('child_process')

const renderrerPath = path.join(__dirname, 'render.js');

function spawnPhantomRender(html, width, height, cb) {
  childProcess.execFile('phantomjs', [renderrerPath, html, width, height], function(err, id) {
    cb && cb(err, id);
  });
}

module.exports = spawnPhantomRender;