var fs = require('fs');

module.exports = function(static) {
  static.handlebars.registerAsyncHelper('api-toc', function(options, complete) {
    static.transform('src/api.md', function(html) {
      static.$(html, function(window) {
        var output = '<ul class="sidebar-primary">';
        var $ = window.$;
        $('h2').each(function() {
          output += '<li><a href="#' + $(this).attr('id') + '">' + cleanSignatures($(this).html()) + '</a>';
          var h3s = $(this).nextUntil("h2", "h3");
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
    static.transform('src/api.md', function(html) {
      static.$(html, function(window) {
        var $ = window.$;
        $('h2, h3').each(function() {
          json[cleanSignatures($(this).html())] = $(this).attr('id');
        });
        complete(JSON.stringify(json));
      });
    });
  });

  static.handlebars.registerHelper('tutorials-toc', function(options, complete) {
    var output = '<ul>';
    fs.readdirSync('src/tutorials').forEach(function(tutorial) {
      output += '<li><a href="/tutorials/' + tutorial.replace(/\.md/, '.html') + '">' + titleFromTutorial('src/tutorials/' + tutorial) + '</a></li>'
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

/*
  <ul class="sidebar-primary">
    <li>
      <a href="#registry">Registry</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#registry/name-klass-prototype-name">name </a>
        </li>
        <li>
          <a href="#registry/templates-thorax-templates">templates </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#thorax-view">Thorax.View</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#thorax-view/children-view-children">children </a>
        </li>
        <li>
          <a href="#thorax-view/parent-view-parent">parent </a>
        </li>
        <li>
          <a href="#thorax-view/template-view-template">template </a>
        </li>
        <li>
          <a href="#thorax-view/destroy-view-destroy-options">destroy </a>
        </li>
        <li>
          <a href="#thorax-view/render-view-render-content">render </a>
        </li>
        <li>
          <a href="#thorax-view/context-view-context">context </a>
        </li>
        <li>
          <a href="#thorax-view/rendertemplate-view-rendertemplate-name-extracontext-ignoreerrors">renderTemplate </a>
        </li>
        <li>
          <a href="#thorax-view/ensurerendered-view-ensurerendered">ensureRendered </a>
        </li>
        <li>
          <a href="#thorax-view/html-view-html-content">html </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#view-helpers">View Helpers</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#view-helpers/super-super">super </a>
        </li>
        <li>
          <a href="#view-helpers/template-template-name-options">template </a>
        </li>
        <li>
          <a href="#view-helpers/view-view-name-options">view </a>
        </li>
        <li>
          <a href="#view-helpers/element-element-name-options">element </a>
        </li>
        <li>
          <a href="#view-helpers/registerviewhelper-handlebars-registerviewhelper-name-viewclass-callback">registerViewHelper </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#util">Util</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#util/tag-thorax-util-tag-name-htmlattributes-content-context">tag </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#$">$</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#/view-event-target-view-options">$.view </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#events">Events</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#events/destroyed-destroyed">destroyed </a>
        </li>
        <li>
          <a href="#events/rendered-rendered">rendered </a>
        </li>
        <li>
          <a href="#events/child-child-instance">child </a>
        </li>
        <li>
          <a href="#events/helper-helper-name-args-helperview">helper </a>
        </li>
        <li>
          <a href="#events/helper-name-helper-name-args-helperview">helper:name </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#html-attributes">HTML Attributes</a>
    </li>
    <li>
      <a href="#command-line">Command Line</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#command-line/build-thorax-build-target-plugin-plugin">build </a>
        </li>
        <li>
          <a href="#command-line/templates-thorax-templates-templates-templates-js">templates </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#error-handling">Error Handling</a>
      <ul class="sidebar-secondary">
        <li>
          <a href="#error-handling/onexception-thorax-onexception-name-error">onException </a>
        </li>
      </ul>
    </li>
  </ul>
*/
