var fs = require('fs');

module.exports = function(static) {
  static.handlebars.registerAsyncHelper('api-toc', function(options, complete) {
    static.transform('src/content/api.md', function(html) {
      static.$(html, function($) {
        var output = '<ul class="sidebar-primary">';
        $('h2').each(function() {
          output += '<li><a href="#' + $(this).attr('id') + '">' + cleanSignatures($(this).html()) + '</a>';
          var h3s = [];
          $(this).nextAll().each(function() {
            if ($(this).is('h3')) {
              return false;
            } else {
              h3s.push(this);
            }
          });
          h3s = $(h3s);
          if (h3s.length) {
            output += '<ul class="sidebar-secondary">';
            h3s.each(function() {
              output += '<li><a href="#' + $(this).attr('id') + '">' + cleanSignatures($(this).html()) + '</a>';
            });
            output += '</ul>';
          }
          output += '</li>';
        });
        output += '</ul>';
        complete(output);
      });
    });
  });

  static.handlebars.registerAsyncHelper('api-json', function(options, complete) {
    var json = {};
    static.transform('src/content/api.md', function(html) {
      static.$(html, function($) {
        $('h2, h3').each(function() {
          json[cleanSignatures($(this).html())] = $(this).attr('id');
        });
        complete(JSON.stringify(json));
      });
    });
  });

  static.handlebars.registerHelper('tutorials-toc', function(options, complete) {
    var output = '<ul class="tutorials-toc">';
    fs.readdirSync('src/tutorials').forEach(function(tutorial) {
      output += '<li><h2><a href="/tutorials/' + tutorial.replace(/\.md/, '.html') + '">' + titleFromTutorial('src/tutorials/' + tutorial) + '</a></h2></li>'
    });
    output += '</ul>'
    return new static.handlebars.SafeString(output);
  });

};

function titleFromTutorial(tutorial) {
  return fs.readFileSync(tutorial).toString().split('\n').shift();
}

function cleanSignatures(text) {
  return text.split('<').shift();
}
