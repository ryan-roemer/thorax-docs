var http = require('http'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    domToHtml = require('./lib/domToHtml').domToHtml,
    path = require('path');

function exec(cmd, callback) {
  console.log(cmd);
  require('child_process').exec(cmd, function(error, stdout, stderr) {
    error && process.stderr.write(error.toString());
    stderr && process.stderr.write(stderr);
    stdout && process.stdout.write(stdout);
    callback(stdout);
  });
}

function camelize(string) {
  string = string.replace(/(?:^|[-_])(\w)/g, function (_, c) {
    return c ? c.toUpperCase () : '';
  });
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function compileMarkdown(file, targetFileName) {
  var title = 'Thorax: Backbone + Handlebars';
  var command = "curl -X POST --data-urlencode content@" + file + " --data-urlencode theme=v1 --data-urlencode name=\"" + title + "\" http://documentup.com/compiled?theme=v1";
  console.log(command);
  exec(command, function(stdout) {
    createWindow(stdout.toString(), function(window) {
      modifyOutput(window, true, targetFileName);
      var filename = path.join(__dirname, 'public', targetFileName);
      console.log('writing: ' + filename);
      fs.writeFileSync(filename, domToHtml(window.document, true));
    });
  });
}

function modifyOutput(window, isIndex, targetFilename) {
  var pluginName = camelize(targetFilename.replace(/\.html$/,''));
  //change theme
  window.$('link[rel=stylesheet]').each(function() {
    var href = this.getAttribute('href');
    if (href.match(/documentup\.com/)) {
      this.setAttribute('href', 'screen.css');
    }
  });
  
  //change header
  window.$('#header a').html('Thorax');
  //window.$('#content h1:first').remove();

  //remove signatures from TOC
  window.$('#sections li a').each(function() {
    this.innerHTML = this.innerHTML.replace(/\*.+$/, '');
  });
  //make signatures nicer
  window.$('h3[id] em').each(function() {
    window.$(this).parent().addClass('signature');
  });
  if (isIndex) {
    //insert header
    window.$('#content').prepend('<h1 id="title">Thorax</h1>');
  }
  //remove appended jquery
  window.$('script').last().remove();
  window.$('body').append('<a href="https://github.com/walmartlabs/thorax"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>');
  //remove typekit config
  //window.$('script').last().remove();
  //remove typekit
  //window.$('script').last().remove();

  //append copyright
  window.$('#content').append('<p>Copyright 2013 <a href="http://walmartlabs.com">@WalmartLabs</a></p>');
}

function createWindow(html, callback) {
  jsdom.env(html, [
    'http://code.jquery.com/jquery-1.5.min.js'
  ], function(errors, window) {
    callback(window)
  });
}

var location = process.argv[2];
if (!location) {
  throw new Error('Specify a location: node index.js path/to/thorax');
}

// TODO: move to async.serial
exec('cd src; grunt build', function() {
  exec('cp -r ./src/index.html ./public/index.html', function() {
    exec('cp -r ./src/img ./public/img', function() {
      exec('cp -r ./src/css ./public/css', function() {
        exec('cp -r ./src/js ./public/js', function() {
          compileMarkdown(path.join(location, 'README.md'), 'docs.html');
        });
      });
    });
  });
});
  