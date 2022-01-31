# Prefers Color Scheme [<img src="https://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][Prefers Color Scheme]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[Prefers Color Scheme] applies color schemes with fallbacks provided by the
[Prefers Color Scheme PostCSS plugin](README-POSTCSS.md).

```js
// initialize prefersColorScheme (applies the current OS color scheme, if available)
const prefersColorScheme = require('css-prefers-color-scheme/browser')();

// apply "dark" queries (you can also apply "light")
prefersColorScheme.scheme = 'dark';
```

[Prefers Color Scheme] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any polyfills.
[See it for yourself.](https://app.crossbrowsertesting.com/public/i76b092cd2b52b86/screenshots/z25c0ccdfcc9c9b8956f?size=medium&type=windowed)

To maintain compatibility with browsers supporting `prefers-color-scheme`, the
library will remove `prefers-color-scheme` media queries in favor of
cross-browser compatible `color` media queries. This ensures a seemless
experience, even when JavaScript is unable to run.

## Usage

Use [Prefers Color Scheme] to activate your `prefers-color-scheme` queries:

```js
const prefersColorScheme = require('css-prefers-color-scheme/browser')();
```

By default, the current OS color scheme is applied if your browser supports it.
Otherwise, the light color scheme is applied. You may override this by passing
in a color scheme.

```js
const prefersColorScheme = require('css-prefers-color-scheme/browser')('dark');
```

The `prefersColorScheme` object returns the following properties — `value`,
`hasNativeSupport`, `onChange`, and `removeListener`.

### value

The `value` property returns the currently preferred color scheme, and it can
be changed.

```js
const prefersColorScheme = require('css-prefers-color-scheme/browser')();

// log the preferred color scheme
console.log(prefersColorScheme.scheme);

// apply "dark" queries
prefersColorScheme.scheme = 'dark';
```

### hasNativeSupport

The `hasNativeSupport` boolean represents whether `prefers-color-scheme` is
supported by the browser.

### onChange

The optional `onChange` function is run when the preferred color scheme is
changed, either from the OS or manually.

### removeListener

The `removeListener` function removes the native `prefers-color-scheme`
listener, which may or may not be applied, depending on your browser support.
This is provided to give you complete control over plugin cleanup.

## Dependencies

Web API's:

- [Window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)

ECMA Script:

- `Object.defineProperty`
- `Array.prototype.forEach`
- `Array.prototype.indexOf`
- `RegExp.prototype.exec`
- `String.prototype.match`
- `String.prototype.replace`

[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/css-prefers-color-scheme.svg
[npm-url]: https://www.npmjs.com/package/css-prefers-color-scheme

[PostCSS]: https://github.com/postcss/postcss
[Prefers Color Scheme]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-prefers-color-scheme
