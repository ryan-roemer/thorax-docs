var http = require('http'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    domToHtml = require('./lib/domToHtml').domToHtml,
    path = require('path'),
    exec = require('child_process').exec;

function camelize(string) {
  string = string.replace(/(?:^|[-_])(\w)/g, function (_, c) {
    return c ? c.toUpperCase () : '';
  });
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function compileMarkdown(file) {
  var targetFilename = file.split('/').pop().replace(/\.md$/, '.html'),
      isIndex = false,
      title;
  if (targetFilename === 'README.html') {
    targetFilename = 'index.html';
    isIndex = true;
    title = 'Thorax: Backbone + Handlebars';
  } else {
    title = 'Thorax: ' + camelize(targetFilename.replace(/\.html$/,'')) + ' Plugin';
  }
  var command = "curl -X POST --data-urlencode content@" + file + " --data-urlencode theme=v1 --data-urlencode name=\"" + title + "\" http://documentup.com/compiled?theme=v1";
  console.log(command);
  exec(command, function(error, stdout, stderr) {
    //console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      createWindow(stdout.toString(), function(window) {
        modifyOutput(window, isIndex, targetFilename);
        var filename = path.join(__dirname, 'public', targetFilename);
        console.log('writing: ' + filename);
        fs.writeFileSync(filename, domToHtml(window.document, true));

      });
    }
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
  //append plugin TOC
  window.$('#sections').after('<div class="header"><a href="#">Plugins</a></div><ul class="sections">' + files.map(function(file) {
    if (!file.match(/\.md$/)) {
      return '';
    }
    var pluginPath = file.replace(/\.md$/, '.html').split('/').pop();
    if (pluginPath === 'README.html') {
      return '';
    }
    var pluginName = pluginPath.replace(/\.html$/,'');
    return '<li><a href="' + pluginPath + '">' + camelize(pluginName) + '</a></li>';
  }).join('') + '</ul>')
  //change header
  if (!isIndex) {
    window.$('#header a').html('Thorax').attr('href', 'index.html').append('<span>' + pluginName + ' Plugin</span>');
  } else {
    window.$('#header a').html('Thorax');
    //window.$('#content h1:first').remove();
  }
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
  window.$('#content').append('<p>Copyright 2012 <a href="http://walmartlabs.com">@WalmartLabs</a></p>');
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

var files = [path.join(location, 'README.md')];

fs.readdir(path.join(location, 'docs'), function(err, dir) {
  files = files.concat(dir.map(function(item) {
    return path.join(location, 'docs', item);
  }));
  files.forEach(function(file) {
    if (file.match(/\.md$/)) {
      compileMarkdown(file);
    }
  });
});
