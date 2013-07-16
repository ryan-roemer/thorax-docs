# Error Codes

## button-trigger

`button` helper must have a method name as the first argument or a 'trigger', or a 'method' attribute specified.

## link-href

`link` helper requires an href as the first argument or an `href` attribute.

## collection-element-helper

`collection-element` helper must be declared inside of a `CollectionView`

## super-parent

Cannot use `super` helper when parent has no name or template.

## view-helper-hash-args

Hash arguments are not allowed in the `view` helper as templates should not introduce side effects to view instances.

## layout-element-helper

`layout-element` helper must be used within a `LayoutView`.

## mixed-fetch

Both `set` and `reset` were passed to `fetch`, must use one or the other.

## nested-render

`render` was called which triggered an event handler which in turn called `render`. Infinite recursion was halted.

## handlebars-no-data

Handlebars template compiled without data, use: Handlebars.compile(template, {data: true})
