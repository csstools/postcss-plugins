# Prefers Color Scheme [<img src="https://jonathantneal.github.io/dom-logo.svg" alt="PostCSS" width="90" height="90" align="right">][Prefers Color Scheme]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[Prefers Color Scheme] lets you use light or dark color themes in CSS,
following the [Media Queries] specification.

```bash
npm install css-prefers-color-scheme
```

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
```

[PostCSS] transforms these into cross-browser compatible `color-index` queries:

```css
@media (color-index: 48) {
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

`CSS._prefersColorScheme()` applies these “light mode” and “dark mode” queries
to documents on the fly. The entire frontend script is less than 300 bytes.

[Prefers Color Scheme] works in all major browsers, including Safari 6+ and
Internet Explorer 9+.
[See it for yourself.](https://app.crossbrowsertesting.com/public/i76b092cd2b52b86/screenshots/z25c0ccdfcc9c9b8956f?size=medium&type=windowed)

```js
const prefersColorScheme = require('css-prefers-color-scheme');

// apply "dark" queries
prefersColorScheme('dark');

// apply "light" queries (also disabling "dark" queries)
prefersColorScheme('light');
```

## PostCSS Usage

Add [Prefers Color Scheme] to your project:

```bash
npm install css-prefers-color-scheme --save-dev
```

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

---

## How does the frontend work?

The `color-index` media query is understood in all major browsers going back to
Internet Explorer 9, but all implementations only seem to allow a `color-index`
of `0`.

This script changes `(color-index: 48)` queries into
`not all and (color-index: 48)` to activate “dark mode” specific CSS, and then
it inverts `(color-index: 70)` queries into `not all and (color-index: 48)`
to activate “light mode” specific CSS.

```css
@media (color-index: 70) { /* "light" query */
  body {
    background-color: white;
    color: black;
  }
}
```

These valid queries are accessible to `document.styleSheet`, so no css parsing
is required to use this library, which is how the script is less than 300 bytes.

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
