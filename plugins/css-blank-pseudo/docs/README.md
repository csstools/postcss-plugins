<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packageVersion> 1.0.0 -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <envSupport> -->
<!-- <corsWarning> -->
<!-- <linkList> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you style form elements when they are empty, following 
the [Selectors Level 4] specification.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is preserved.

```js
<exportName>({ preserve: false })
```

```pcss
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

### replaceWith

The `replaceWith` option determines the selector to use when replacing
the `:blank` pseudo. By default is `[blank]`

```js
<exportName>({ replaceWith: '.css-blank' })
```

```pcss
<example.css>

/* becomes */

<example.preserve-true.expect.css>
```

Note that changing this option implies that it needs to be passed to the
browser polyfill as well.

## Browser

```js
import cssBlankPseudoInit from 'css-blank-pseudo/browser';

cssBlankPseudoInit();
```

or

```html
<!-- When using a CDN url you will have to manually update the version number -->
<script src="https://unpkg.com/css-blank-pseudo@<packageVersion>/dist/browser-global.js"></script>
<script>cssBlankPseudoInit()</script>
```

[<humanReadableName>] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any additional polyfills.

This plugin conditionally uses `MutationObserver` to ensure recently inserted 
inputs get correct styling upon insertion. If you intend to rely on that 
behaviour for browsers that do not support `MutationObserver`, you have two
options:

1. Polyfill `MutationObserver`. As long as it runs before `cssBlankPseudoInit`,
the polyfill will work.
2. If you don't want to polyfill `MutationObserver` you can also manually fire
a `change` event upon insertion so they're automatically inspected by the
polyfill.

### Browser Usage

#### force

The `force` option determines whether the library runs even if the browser 
supports the selector or not. By default, it won't run if the browser does
support the selector.

```js
cssBlankPseudoInit({ force: true });
```

#### replaceWith

Similar to the option for the PostCSS Plugin, `replaceWith` determines the
attribute or class to apply to an element when it's considered to be `:blank`.

```js
cssBlankPseudoInit({ replaceWith: '.css-blank' });
```

This option should be used if it was changed at PostCSS configuration level.

<linkList>
[Selectors Level 4]: <specUrl>
