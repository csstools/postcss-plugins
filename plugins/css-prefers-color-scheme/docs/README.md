<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
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

[<humanReadableName>] lets you use light and dark color schemes in all browsers, following the [Media Queries] specification.

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

## Browser

```js
// initialize prefersColorScheme (applies the current OS color scheme, if available)
import prefersColorSchemeInit from '<packageName>/browser';
const prefersColorScheme = prefersColorSchemeInit();

// apply "dark" queries (you can also apply "light")
prefersColorScheme.scheme = 'dark';
```

or

```html
<!-- When using a CDN url you will have to manually update the version number -->
<script src="https://unpkg.com/<packageName>@7.0.0/dist/browser-global.js"></script>
<script>prefersColorSchemeInit()</script>
```

[Prefers Color Scheme] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any additional polyfills.

To maintain compatibility with browsers supporting `prefers-color-scheme`, the
library will remove `prefers-color-scheme` media queries in favor of
cross-browser compatible `color` media queries. This ensures a seemless
experience, even when JavaScript is unable to run.

### Browser Usage

Use [Prefers Color Scheme] to activate your `prefers-color-scheme` queries:

```js
import prefersColorSchemeInit from '<packageName>/browser';
const prefersColorScheme = prefersColorSchemeInit();
```

By default, the current OS color scheme is applied if your browser supports it.
Otherwise, the light color scheme is applied. You may override this by passing
in a color scheme.

```js
import prefersColorSchemeInit from '<packageName>/browser';
const prefersColorScheme = prefersColorSchemeInit('dark');
```

The `prefersColorScheme` object returns the following properties — `scheme`,
`hasNativeSupport`, `onChange`, and `removeListener`.

#### scheme

The `scheme` property returns the currently preferred color scheme, and it can
be changed.

```js
import prefersColorSchemeInit from '<packageName>/browser';
const prefersColorScheme = prefersColorSchemeInit();

// log the preferred color scheme
console.log(prefersColorScheme.scheme);

// apply "dark" queries
prefersColorScheme.scheme = 'dark';
```

#### hasNativeSupport

The `hasNativeSupport` boolean represents whether `prefers-color-scheme` is
supported by the browser.

#### onChange

The optional `onChange` function is run when the preferred color scheme is
changed, either from the OS or manually.

#### removeListener

The `removeListener` function removes the native `prefers-color-scheme`
listener, which may or may not be applied, depending on your browser support.
This is provided to give you complete control over plugin cleanup.

#### debug mode

If styles are not applied you can enable debug mode to log exceptions.

```js
import prefersColorSchemeInit from '<packageName>/browser';
const prefersColorScheme = prefersColorSchemeInit('light', { debug: true });
```

```html
<script src="https://unpkg.com/<packageName>@7.0.0/dist/browser-global.js"></script>
<script>prefersColorSchemeInit('light', { debug: true })</script>
```


### Browser Dependencies

Web API's:

- [Window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)

ECMA Script:

- `Object.defineProperty`
- `Array.prototype.forEach`
- `Array.prototype.indexOf`
- `RegExp.prototype.exec`
- `String.prototype.match`
- `String.prototype.replace`

<corsWarning>

## How does it work?

[Prefers Color Scheme] is a [PostCSS] plugin that transforms `prefers-color-scheme` queries into `color` queries.
This changes `prefers-color-scheme: dark` into `(color: 48842621)` and `prefers-color-scheme: light` into `(color: 70318723)`.

The frontend receives these `color` queries, which are understood in all
major browsers going back to Internet Explorer 9.
However, since browsers can only have a reasonably small number of bits per color,
our color scheme values are ignored.

[Prefers Color Scheme] uses a [browser script](#browser) to change
`(color: 48842621)` queries into `(max-color: 48842621)` in order to
activate “dark mode” specific CSS, and it changes `(color: 70318723)` queries
into `(max-color: 48842621)` to activate “light mode” specific CSS.

```css
@media (color: 70318723) { /* prefers-color-scheme: light */
	body {
		background-color: white;
		color: black;
	}
}
```

Since these media queries are accessible to `document.styleSheet`, no CSS
parsing is required.

### Why does the fallback work this way?

The value of `48` is chosen for dark mode because it is the keycode for `0`,
the hexidecimal value of black. Likewise, `70` is chosen for light mode because
it is the keycode for `f`, the hexidecimal value of white.
These are suffixed with a random large number.

<linkList>
[Media Queries]: <specUrl>
