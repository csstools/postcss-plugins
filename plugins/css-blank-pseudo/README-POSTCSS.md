# CSS Blank Pseudo for PostCSS [<img src="http://jonathantneal.github.io/postcss-logo.svg" alt="" width="90" height="90" align="right">][CSS Blank Pseudo]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[CSS Blank Pseudo] lets you style form elements when they are empty, following
the [Selectors Level 4] specification.

```css
input:blank {
  background-color: yellow;
}

/* becomes */

.field[blank] label {
  background-color: yellow;
}

.field:blank label {
  background-color: yellow;
}
```

[CSS Blank Pseudo] duplicates rules using the `:blank` pseudo-class with a
`[blank]` attribute selector. This replacement selector can be changed
using the `replaceWith` option. Also, the preservation of the original
`:blank` rule can be disabled using the `preserve` option.

## Usage

Add [CSS Blank Pseudo] to your project:

```bash
npm install css-blank-pseudo --save-dev
```

Use [CSS Blank Pseudo] to process your CSS:

```js
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

postcssBlankPseudo.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

postcss([
  postcssBlankPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[CSS Blank Pseudo] runs in all Node environments, with special
instructions for:

| [Node](INSTALL-POSTCSS.md#node) | [PostCSS CLI](INSTALL-POSTCSS.md#postcss-cli) | [Webpack](INSTALL-POSTCSS.md#webpack) | [Create React App](INSTALL-POSTCSS.md#create-react-app) | [Gulp](INSTALL-POSTCSS.md#gulp) | [Grunt](INSTALL-POSTCSS.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option defines whether the original selector should remain. By
default, the original selector is preserved.

```js
focusWithin({ preserve: false });
```

```css
input:blank {
  background-color: yellow;
}

/* becomes */

.field[blank] label {
  background-color: yellow;
}
```

### replaceWith

The `replaceWith` option defines the selector to replace `:blank`. By
default, the replacement selector is `[blank]`.

```js
focusWithin({ replaceWith: '.blank' });
```

```css
input:blank {
  background-color: yellow;
}

/* becomes */

.field.blank label {
  background-color: yellow;
}

.field:blank label {
  background-color: yellow;
}
```

[cli-img]: https://img.shields.io/travis/csstools/css-blank-pseudo/master.svg
[cli-url]: https://travis-ci.org/csstools/css-blank-pseudo
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/css-blank-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-blank-pseudo

[CSS Blank Pseudo]: https://github.com/csstools/css-blank-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#blank
