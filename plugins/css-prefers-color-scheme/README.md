# Prefers Color Scheme [<img src="https://jonathantneal.github.io/dom-logo.svg" alt="PostCSS" width="90" height="90" align="right">][Prefers Color Scheme]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[Prefers Color Scheme] lets you use light and dark color schemes in all
browsers, following the [Media Queries] specification.

```bash
npm install css-prefers-color-scheme
```

There are 2 steps required to get color schemes working:

- Transform your queries using the included [PostCSS plugin](#PostCSS-Plugin).
- Apply your queries using the included [browser library](#Browser-Library).

## PostCSS Plugin

[Prefers Color Scheme] transforms `prefers-color-scheme` media queries into
something all browsers understand.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --site-bgcolor: #1b1b1b;
    --site-color: #fff;
  }
}

body {
  background-color: var(--site-bgcolor, #f9f9f9);
  color: var(--site-color, #111);
  font: 100%/1.5 system-ui;
}

/* becomes */

@media (color-index: 48) {
  :root {
    --site-bgcolor: #1b1b1b;
    --site-color: #fff;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --site-bgcolor: #1b1b1b;
    --site-color: #fff;
  }
}

body {
  background-color: var(--site-bgcolor, #f9f9f9);
  color: var(--site-color, #111);
  font: 100%/1.5 system-ui;
}
```

## Browser Library

[Prefers Color Scheme] applies color schemes previously transformed by the
[PostCSS plugin](#PostCSS-Plugin).

```js
// initialize prefersColorScheme (applies the system color scheme, if available)
const prefersColorScheme = require('css-prefers-color-scheme')();

// apply "dark" queries
prefersColorScheme.scheme = 'dark';

// apply "light" queries (also disabling "dark" queries)
prefersColorScheme.scheme = 'light';
```

The script is also available from the [unpkg.com](https://unpkg.com/) CDN:

```html
<script src="https://unpkg.com/css-prefers-color-scheme/browser.js"></script>
<script>
// initialize prefersColorScheme (applies the system color scheme, if available)
initPrefersColorScheme()
</script>
```

A minified version is also available:

```html
<script src="https://unpkg.com/css-prefers-color-scheme/browser.js"></script>
<script>
// initialize prefersColorScheme (applies the system color scheme, if available)
initPrefersColorScheme()
</script>
```

[Prefers Color Scheme] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any polyfills.
[See it for yourself.](https://app.crossbrowsertesting.com/public/i76b092cd2b52b86/screenshots/z25c0ccdfcc9c9b8956f?size=medium&type=windowed)

To maintain compatibility with browsers supporting `prefers-color-scheme`, the
library will remove `prefers-color-scheme` media queries in favor of the
cross-browser compatible `color-index` media queries. This ensures a seemless
experience when JavaScript is unable to run.

---

## Browser Usage

Use [Prefers Color Scheme] to activate your `prefers-color-scheme` queries:

```js
const prefersColorScheme = require('css-prefers-color-scheme')();
```

By default, the system color scheme is applied, if your browser supports it.
Otherwise, the light color scheme is applied. You may override this by passing
in a color scheme.

```js
const prefersColorScheme = require('css-prefers-color-scheme')('dark');
```

The `prefersColorScheme` object returns the following properties:

### value

The `value` property returns the currently preferred color scheme, and can be
set to change it.

```js
const prefersColorScheme = require('css-prefers-color-scheme')();

// log the preferred color scheme
console.log(prefersColorScheme.scheme);

// apply "dark" queries
prefersColorScheme.scheme = 'dark';
```

### hasNativeSupport

The `hasNativeSupport` boolean represents whether `prefers-color-scheme` is
supported by the current browser.

### onChange

The `onChange` function can be added in order to listen for changes to the
preferred color scheme, whether they are triggered by the system or manually by
the `change` function.

### removeListener

The `removeListener` function removes the native `prefers-color-scheme`
listener, which may or may not be applied, depending on your browser support.
This is provided to give you complete control over plugin cleanup.

---

## PostCSS Usage

Use [Prefers Color Scheme] to process your CSS:

```js
const postcssPrefersColorScheme = require('css-prefers-color-scheme/postcss');

postcssPrefersColorScheme.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPrefersColorScheme = require('css-prefers-color-scheme/postcss');

postcss([
  postcssPrefersColorScheme(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[Prefers Color Scheme] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- |

### Options

#### preserve

The `preserve` option determines whether the original `prefers-color-scheme`
query will be preserved or removed. By default, it is preserved.


```js
require('css-prefers-color-scheme/postcss')({ preserve: false });
```

```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: black;
  }
}

/* becomes */

@media (color-index: 48) {
  body {
    background-color: black;
  }
}
```

---

## How does it work?

The [Prefers Color Scheme] [PostCSS plugin](#PostCSS-Plugin) transforms
`prefers-color-scheme` queries into `color-index` queries, changing
`prefers-color-scheme: dark` into `(color-index: 48)`,
`prefers-color-scheme: light` into `(color-index: 70)`, and
`prefers-color-scheme: no-preference` into `(color-index: 22)`.

The frontend receives these `color-index` queries, which are understood in all
major browsers going back to Internet Explorer 9. However, all browsers only
apply a `color-index` of `0`, so all other values are otherwise ignored.

[Prefers Color Scheme] changes `(color-index: 48)` queries into
`not all and (color-index: 48)` to activate “dark mode” specific CSS, and then
it inverts `(color-index: 70)` queries into `not all and (color-index: 48)`
to activate “light mode” specific CSS.

```css
@media (color-index: 70) { /* prefers-color-scheme: light */
  body {
    background-color: white;
    color: black;
  }
}
```

These valid queries are accessible to `document.styleSheet`, so no css parsing
is required to use this library, which is how the script is only 539 bytes.

## Why does the fallback work this way?

The value of `48` is chosen for dark mode because it is the keycode for `0`,
the hexidecimal value of black. Likewise, `70` is chosen for light mode because
it is the keycode for `f`, the hexidecimal value of white.

[cli-img]: https://img.shields.io/travis/csstools/css-prefers-color-scheme.svg
[cli-url]: https://travis-ci.org/csstools/css-prefers-color-scheme
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/css-prefers-color-scheme.svg
[npm-url]: https://www.npmjs.com/package/css-prefers-color-scheme

[PostCSS]: https://github.com/postcss/postcss
[Prefers Color Scheme]: https://github.com/csstools/css-prefers-color-scheme
[Media Queries]: https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-color-scheme
