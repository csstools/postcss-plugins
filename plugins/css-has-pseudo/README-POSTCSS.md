# CSS Has Pseudo for PostCSS [<img src="http://jonathantneal.github.io/postcss-logo.svg" alt="" width="90" height="90" align="right">][CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[CSS Has Pseudo] lets you style elements relative to other elements in CSS,
following the [Selectors Level 4] specification.

```css
body:has(:focus) {
  background-color: yellow;
}

/* becomes */

body[\:has\(\:focus\)] {
  background-color: yellow;
}

body:has(:focus) {
  background-color: yellow;
}
```

[CSS Has Pseudo] duplicates rules using the `:has` pseudo-class with a `[has]`
attribute selector. The preservation of the original `:has` rule can be
disabled using the `preserve` option.

## Usage

Add [CSS Has Pseudo] to your project:

```bash
npm install css-has-pseudo --save-dev
```

Use [CSS Has Pseudo] to process your CSS:

```js
const postcssHasPseudo = require('css-has-pseudo/postcss');

postcssHasPseudo.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssHasPseudo = require('css-has-pseudo/postcss');

postcss([
  postcssHasPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[CSS Has Pseudo] runs in all Node environments, with special
instructions for:

| [Node](INSTALL-POSTCSS.md#node) | [PostCSS CLI](INSTALL-POSTCSS.md#postcss-cli) | [Webpack](INSTALL-POSTCSS.md#webpack) | [Create React App](INSTALL-POSTCSS.md#create-react-app) | [Gulp](INSTALL-POSTCSS.md#gulp) | [Grunt](INSTALL-POSTCSS.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option defines whether the original selector should remain. By
default, the original selector is preserved.

```js
hasPseudo({ preserve: false });
```

```css
body:has(:focus) {
  background-color: yellow;
}

/* becomes */

body[\:has\(\:focus\)] {
  background-color: yellow;
}
```

[cli-img]: https://img.shields.io/travis/csstools/css-has-pseudo/master.svg
[cli-url]: https://travis-ci.org/csstools/css-has-pseudo
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/css-has-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-has-pseudo

[CSS Has Pseudo]: https://github.com/csstools/css-has-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has-pseudo
