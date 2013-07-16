

## Hello World

Thorax is used to build some of the biggest Backbone applications in the world but it's easy to get started.

    var view = new Thorax.View({
      greeting: "Hello",
      template: Handlebars.compile("{{greeting}} world!")
    });
    view.appendTo('body');

## Easy Data Binding

By default every property of your view is automatically available in the template. If a model is bound its attributes will also be made available.

    var view = new Thorax.View({
      greeting: 'Hello',
      model: new Thorax.Model({
        location: 'world!'
      }),
      template: ...
    });

Then in your template:

    {{greeting}} {{location}}

## Context Control

Don't like every property in your view being available in your template, or need to modify some model attributes? Just specify a `context` method to control what your template sees:

    var view = new Thorax.View({
      model: new Thorax.Model({
        greeting: 'hello'
      }),
      context: function() {
        return {
          greeting: this.model.get('greeting').toUpperCase()
        };
      },
      template: ...
    });

Then in your template:

    {{greeting}}

## Collection Rendering

Easily render collections with the `collection` helper. Thorax will make sure that your view stays current as models in your collection are added, removed or updated.

    var view = new Thorax.View({
      collection: new Thorax.Collection([{
        title: 'Finish screencast',
        done: true
      }]),
      template: ...
    });

Then in your template:

    {{#collection tag="ul"}}
      <li>
        <input type="checkbox" {{#done}}checked{{/done}}
        {{title}}
      </li>
    {{else}}
      <li>No todos yet.</li>
    {{/collection}}

## jQuery and Zepto Integration

Thorax extends the jQuery or Zepto `$` object to allow you to get a reference to the nearest bound `model`, `collection`, or `view`.

    var view = new Thorax.View({
      events: {
        'change input[type=checkbox]': function(event) {
          var model = $(event.target).model();
          model.set({done: event.target.checked});
        }
      }
    });

## Event Enhancements

Thorax extends the events hash to let you listen to view events in addition to DOM events, and let's you pass a hash of `model` or `collection` events to `listenTo` when a model or collection is bound to your view.

    var view = new Thorax.View({
      events: {
        rendered: function() {}
        model: {
          change: function() {}
        }
      },
      model: new Thorax.Model()
    });

Thorax also adds inheritable events to view classes, just call `on` on any class to listen for a DOM, view, model or collection event on any view.

    Thorax.View.on('eventName', handler);

## Form Handling

Easily capture entered form data with the `serialize` method which also provides event hooks for form validation. Models bound to the view will also automatically `populate` your forms.

    var view = new Thorax.View({
      events: {
        'submit form': function(event) {
          event.preventDefault();
          var attrs = this.serialize();
          this.collection.add(attrs);
        }
      },
      collection: new Thorax.Collection()
    });

## Embeddable Views

Easily embed one view within another with the `view` helper.

    var view = new Thorax.View({
      child: new Thorax.View(...),
      template: ...
    });

Then in your template:

    {{view child}}

## Layouts and Lifecycle

`Thorax.LayoutView` provides a container to place your views, and triggers lifecycle events on views placed within them. Layouts can be embedded in other views as well.

    var layout = new Thorax.LayoutView();
    layout.appendTo('body');
    var view = new Thorax.View({
      events: {
        ready: function() {},
        destroyed: function() {}
      }
    })
    layout.setView(view);
