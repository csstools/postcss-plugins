# Prefers Color Scheme [<img src="https://jonathantneal.github.io/postcss-logo.svg" alt="" width="90" height="90" align="right">][Prefers Color Scheme]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

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

@media (color: 48842621) {
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
npx css-prefers-color-scheme INPUT.css --output OUTPUT.css
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPrefersColorScheme = require('css-prefers-color-scheme');

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
require('css-prefers-color-scheme')({ preserve: false });
```

```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: black;
  }
}

/* becomes */

@media (color: 48842621) {
  body {
    background-color: black;
  }
}
```

#### mediaQuery

The `mediaQuery` option defines if either `color` or `color-index` should be used.
Without passing an option CSS for both will be provided.
When omitted CSS is generated that is compatible with the both the new and old browser polyfill.
This setting allows you to shrink your bundle size.

In a future version this setting will be removed and only `color` queries will be generated.

You have updated the browser polyfill :
_version 6 or higher_

```js
postcssPrefersColorScheme({ mediaQuery: 'color' });
```

You have **not** updated the browser polyfill :
_version 5 or lower_

```js
postcssPrefersColorScheme({ mediaQuery: 'color-index' });
```

You are unsure :

```js
postcssPrefersColorScheme();
```

[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/css-prefers-color-scheme.svg
[npm-url]: https://www.npmjs.com/package/css-prefers-color-scheme

[PostCSS]: https://github.com/postcss/postcss
[Prefers Color Scheme]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-prefers-color-scheme
