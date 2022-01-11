# EXPERIMENTAL : CSS Has Pseudo for PostCSS [<img src="http://jonathantneal.github.io/postcss-logo.svg" alt="" width="90" height="90" align="right">][EXPERIMENTAL CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[![Support Chat][git-img]][git-url]

⚠️ Experimental version of [CSS Has Pseudo](https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo)

[EXPERIMENTAL CSS Has Pseudo] lets you style elements relative to other elements in CSS,
following the [Selectors Level 4] specification.

```css
body:has(:focus) {
  background-color: yellow;
}

/* becomes */

[body\:has\(\:focus\)] {
	background-color: yellow;
}

body:has(:focus) {
	background-color: yellow;
}
```

[EXPERIMENTAL CSS Has Pseudo] duplicates rules using the `:has` pseudo-class with a `[has]`
attribute selector. The preservation of the original `:has` rule can be
disabled using the `preserve` option.

## Usage

Add [EXPERIMENTAL CSS Has Pseudo] to your project:

```bash
npm install @csstools/css-has-pseudo-experimental --save-dev
```

Use [EXPERIMENTAL CSS Has Pseudo] as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const cssHasPseudoExperimental = require('@csstools/css-has-pseudo-experimental');

postcss([
  cssHasPseudoExperimental(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[EXPERIMENTAL CSS Has Pseudo] runs in all Node environments, with special
instructions for:

| [Node](INSTALL-POSTCSS.md#node) | [PostCSS CLI](INSTALL-POSTCSS.md#postcss-cli) | [Webpack](INSTALL-POSTCSS.md#webpack) | [Create React App](INSTALL-POSTCSS.md#create-react-app) | [Gulp](INSTALL-POSTCSS.md#gulp) | [Grunt](INSTALL-POSTCSS.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option defines whether the original selector should remain. By
default, the original selector is preserved.

```js
cssHasPseudoExperimental({ preserve: false });
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

## PostCSS Preset Env

When you use `postcss-preset-env` you must disable the regular plugin.

The experimental plugin must be added after any other plugin that modifies selectors.

```js
plugins: [
  // other plugins
  postcssPresetEnv({
    features: {
      'css-has-pseudo': false
    }
  }),
  // other plugins
  cssHasPseudoExperimental(), // last
]
```

[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/@csstools/css-has-pseudo-experimental.svg
[npm-url]: https://www.npmjs.com/package/@csstools/css-has-pseudo-experimental

[PostCSS]: https://github.com/postcss/postcss
[EXPERIMENTAL CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/experimental/css-has-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has-pseudo
