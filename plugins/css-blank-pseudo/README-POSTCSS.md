# CSS Blank Pseudo for PostCSS [<img src="http://jonathantneal.github.io/postcss-logo.svg" alt="" width="90" height="90" align="right">][CSS Blank Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

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
const postcssBlankPseudo = require('css-blank-pseudo');

postcssBlankPseudo.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBlankPseudo = require('css-blank-pseudo');

postcss([
  postcssBlankPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[CSS Blank Pseudo] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option defines whether the original selector should remain. By
default, the original selector is preserved.

```js
cssBlankPseudo({ preserve: false });
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
cssBlankPseudo({ replaceWith: '.blank' });
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

[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/css-blank-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-blank-pseudo

[CSS Blank Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#blank
