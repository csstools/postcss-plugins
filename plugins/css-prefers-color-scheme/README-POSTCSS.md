# Prefers Color Scheme [<img src="https://jonathantneal.github.io/postcss-logo.svg" alt="" width="90" height="90" align="right">][Prefers Color Scheme]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

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

## Usage

Use [Prefers Color Scheme] to process your CSS:

```bash
npx css-prefers-color-scheme INPUT.css OUTPUT.css
```

Or use it within Node:

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

[cli-img]: https://img.shields.io/travis/csstools/css-prefers-color-scheme/master.svg
[cli-url]: https://travis-ci.org/csstools/css-prefers-color-scheme
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/css-prefers-color-scheme.svg
[npm-url]: https://www.npmjs.com/package/css-prefers-color-scheme

[PostCSS]: https://github.com/postcss/postcss
[Prefers Color Scheme]: https://github.com/csstools/css-prefers-color-scheme
