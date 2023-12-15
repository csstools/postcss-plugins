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
<!-- <parallelBuildsNotice> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you use the `:focus-visible` pseudo-class in CSS, 
following the [Selectors Level 4 specification].

To use this feature you need to do two things :
- add the [PostCSS plugin](#usage) that transforms the selector into a class or attribute
- add the [focus-visible polyfill] that sets the attribute or class on elements in a browser

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

### disablePolyfillReadyClass

The `disablePolyfillReadyClass` option determines if selectors are prefixed with an indicator class.
This class is only set on your document if the polyfill loads and is needed.

By default this option is `false`.
Set this to `true` to prevent the class from being added.

```js
<exportName>({ disablePolyfillReadyClass: true })
```

```pcss
<example.css>

/* becomes */

<example.disable-polyfill-ready-class.expect.css>
```

<linkList>
[Selectors Level 4 specification]: <specUrl>
[focus-visible polyfill]: https://github.com/WICG/focus-visible
