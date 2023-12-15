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

[<humanReadableName>] lets you use the `:focus-within` pseudo-class in CSS, 
following the [Selectors Level 4 specification].

To use this feature you need to do two things :
- add the [PostCSS plugin](#usage) that transforms the selector into a class or attribute
- add the [browser polyfill](#browser) that sets the attribute or class on elements in a browser

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
Please note that using a class, leverages `classList` under the hood which
might  not be supported on some old browsers such as IE9, so you may need
to polyfill `classList` in those cases.

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

### Using with Next.js

Given that Next.js imports packages both on the browser and on the server, you need to make sure that the package is only imported on the browser.

As outlined in the [Next.js documentation](https://nextjs.org/docs/advanced-features/dynamic-import#with-external-libraries), you need to load the package with a dynamic import:

```jsx
useEffect(async () => {
	const focusWithinInit = (await import('<packageName>/browser')).default;
	focusWithinInit();
}, []);
```

<linkList>
[Selectors Level 4 specification]: <specUrl>
