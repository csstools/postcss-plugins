# EXPERIMENTAL : CSS Has Pseudo for PostCSS [<img src="http://jonathantneal.github.io/postcss-logo.svg" alt="" width="90" height="90" align="right">][EXPERIMENTAL CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

⚠️ Experimental version of [CSS Has Pseudo](https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo)

[EXPERIMENTAL CSS Has Pseudo] lets you style elements relative to other elements in CSS,
following the [Selectors Level 4] specification.

```css
body:has(:focus) {
	background-color: yellow;
}

/* becomes */

[csstools-has-2q-33-2s-3d-1m-2w-2p-37-14-1m-2u-33-2r-39-37-15]:not(does-not-exist) {
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

[csstools-has-2q-33-2s-3d-1m-2w-2p-37-14-1m-2u-33-2r-39-37-15]:not(does-not-exist) {
	background-color: yellow;
}
```

### specificityMatchingName

The `specificityMatchingName` option allows you to change to selector that is used to adjust specificity.
The default value is `does-not-exist`.
If this is an actual class, id or tag name in your code, you will need to set a different option here.

See how `:not` is used to modify [specificity](#specificity).

```js
postcss([
	cssHasPseudoExperimental({ specificityMatchingName: 'something-random' })
]).process(YOUR_CSS /*, processOptions */);
```

[specificity 1, 2, 0](https://polypane.app/css-specificity-calculator/#selector=.x%3Ahas(%3E%20%23a%3Ahover))

Before :

```css
.x:has(> #a:hover) {
	order: 11;
}
```

After :

[specificity 1, 2, 0](https://polypane.app/css-specificity-calculator/#selector=%5Bcsstools-has-1a-3c-1m-2w-2p-37-14-1q-w-z-2p-1m-2w-33-3a-2t-36-15%5D%3Anot(%23does-not-exist)%3Anot(.does-not-exist))

```css
[csstools-has-1a-3c-1m-2w-2p-37-14-1q-w-z-2p-1m-2w-33-3a-2t-36-15]:not(#does-not-exist):not(.does-not-exist) {
	order: 11;
}
```

## ⚠️ Known shortcomings

### Specificity

`:has` transforms will result in at least one tag selector with specificity `0, 1, 0`.
If your selector has only tags we won't be able to match the original specificity.

Before :

[specificity 0, 0, 2](https://polypane.app/css-specificity-calculator/#selector=figure%3Ahas(%3E%20img))

```css
figure:has(> img)
```

After :

[specificity 0, 1, 2](https://polypane.app/css-specificity-calculator/#selector=%5Bcsstools-has-2u-2x-2v-39-36-2t-1m-2w-2p-37-14-1q-w-2x-31-2v-15%5D%3Anot(does-not-exist)%3Anot(does-not-exist))

```css
[csstools-has-2u-2x-2v-39-36-2t-1m-2w-2p-37-14-1q-w-2x-31-2v-15]:not(does-not-exist):not(does-not-exist)
```

### Plugin order

As selectors are encoded this plugin (or `postcss-preset-env`) must be run after any other plugin that transforms selectors.

For `postcss-preset-env` we take care to handle this for you.

If other plugins are used you need to place these in your config before `postcss-preset-env` or `css-has-pseudo`.

Please let us know if you have issues with plugins that transform selectors.
Then we can investigate and maybe fix these.

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

[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/@csstools/css-has-pseudo-experimental.svg
[npm-url]: https://www.npmjs.com/package/@csstools/css-has-pseudo-experimental

[PostCSS]: https://github.com/postcss/postcss
[EXPERIMENTAL CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/experimental/css-has-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has-pseudo
