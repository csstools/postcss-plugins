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

[<humanReadableName>] lets you use the `:focus-visible` pseudo-class in CSS, 
following the [Selectors Level 4 specification].

It is the companion to the [focus-visible polyfill]. Note that this plugin
alone **is not** sufficient to polyfill for `:focus-visible` and that you need
the browser's polyfill as well.

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-focus-visible.png)](https://caniuse.com/#feat=css-focus-visible)

```css

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

[PostCSS Focus Visible] duplicates rules using the `:focus-visible` pseudo-class
with a `.focus-visible` class selector, the same selector used by the
[focus-visible polyfill].

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
<exportName>({ preserve: true })
```

```pcss
<example.css>

/* becomes */

<example.preserve-true.expect.css>
```

### replaceWith

The `replaceWith` option defines the selector to replace `:focus-visible`. By
default, the replacement selector is `.focus-visible`.

```js
<exportName>({ replaceWith: '[data-focus-visible-added]' })
```

```pcss
<example.css>

/* becomes */

<example.preserve-true.expect.css>
```

Note that if you want to keep using [focus-visible polyfill], the only 
acceptable value would be `[data-focus-visible-added]`,
given that the polyfill does not support arbitrary values.

<linkList>
[Selectors Level 4 specification]: <specUrl>
[focus-visible polyfill]: https://github.com/WICG/focus-visible
