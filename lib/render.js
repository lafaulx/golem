var page = require('webpage').create();
var system = require('system');

var args = system.args.slice(1);
var htmlPath = args[0];
var img = args[1];
var width = parseInt(args[2], 10);
var height = parseInt(args[3], 10);

page.viewportSize = { width: width, height : height };

page.open('file://' + htmlPath, function() {
  page.render(img, { quality: 100, format: 'png'});

  phantom.exit();
})