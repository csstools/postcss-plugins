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

[<humanReadableName>] lets you use the `:focus-within` pseudo-class in CSS, 
following the [Selectors Level 4 specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

[<humanReadableName>] duplicates rules using the `:focus-within` pseudo-class
with a `[focus-within]` attribute selector, the same selector used by the
focus-within polyfill. This replacement selector can be changed using the
`replaceWith` option. Also, the preservation of the original `:focus-within`
rule can be disabled using the `preserve` option.

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

The `replaceWith` option defines the selector to replace `:focus-within`. By
default, the replacement selector is `[focus-within]`.

```js
<exportName>({ replaceWith: '.focus-within' });
```

```pcss
<example.css>

/* becomes */

<example.replacewith.expect.css>
```

Note that changing this option implies that it needs to be passed to the
browser polyfill as well.

## Browser

```js
import focusWithinInit from 'postcss-focus-within/browser';

focusWithinInit();
```

or

```html
<!-- When using a CDN url you will have to manually update the version number -->
<script src="https://unpkg.com/postcss-focus-within@<packageVersion>/dist/browser-global.js"></script>
<script>focusWithinInit()</script>
```

[<humanReadableName>] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any additional polyfills.

### Browser Usage

#### force

The `force` option determines whether the library runs even if the browser
supports the selector or not. By default, it won't run if the browser does
support the selector.

```js
focusWithinInit({ force: true });
```

#### replaceWith

Similar to the option for the PostCSS Plugin, `replaceWith` determines the
attribute or class to apply to an element when it's considered to be `:focus-within`.

```js
focusWithinInit({ replaceWith: '.focus-within });
```

This option should be used if it was changed at PostCSS configuration level.

<linkList>
[Selectors Level 4 specification]: <specUrl>
