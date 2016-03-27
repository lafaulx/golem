const path = require('path')
const childProcess = require('child_process')
const uuid = require('node-uuid');
const fs = require('fs');

const config = require('../local_config');

const renderrerPath = path.join(__dirname, 'render.js');

function spawnPhantomRender(html, width, height, cb) {
  const id = uuid.v4()
  const imgName = `${id}.png`;
  const htmlName= `${id}.html`;
  const imgPath = path.join(config.TEMP_DIR, imgName);
  const htmlPath = path.join(config.TEMP_DIR, htmlName);

  fs.writeFile(htmlPath, html, function(err) {
    if (err) {
      cb && cb(err);
      return;
    }

    childProcess.execFile('phantomjs', [renderrerPath, htmlPath, imgPath, width, height], function(err, stdout, stderr) {
      if (err || stderr) {
        cb && cb([err, stderr]);
        return;
      }

      cb && cb(null, imgName);
    });
  });
}

module.exports = spawnPhantomRender;