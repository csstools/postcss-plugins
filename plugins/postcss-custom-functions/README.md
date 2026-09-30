# PostCSS Custom Functions [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-custom-functions.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install @csstools/postcss-custom-functions --save-dev
```

[PostCSS Custom Functions] lets you use `@function` custom functions following [CSS Custom Functions and Mixins 1].

Custom functions are still an early draft.  
This plugin is only a partial implementation to avoid conflicts with the final specification.

Unsupported:
- typed parameters and return types
- default parameter values

```css
@function --negative(--value) {
	result: calc(-1 * var(--value));
}

@function --double(--value) {
	result: calc(2 * var(--value));
}

html {
	--gap: 1em;
	padding: --negative(var(--gap));
	margin: --double(4px);
}

/* becomes */

html {--csstools-custom-function-0-arg-0: var(--gap);
}
html {
	--csstools-custom-function-0-result: calc(-1 * var(--csstools-custom-function-0-arg-0));
}
html {--csstools-custom-function-1-arg-0: 4px;
}
html {
	--csstools-custom-function-1-result: calc(2 * var(--csstools-custom-function-1-arg-0));
}
html {
	--gap: 1em;
	padding: var(--csstools-custom-function-0-result);
	margin: var(--csstools-custom-function-1-result);
}
```

## Usage

Add [PostCSS Custom Functions] to your project:

```bash
npm install postcss @csstools/postcss-custom-functions --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomFunctions = require('@csstools/postcss-custom-functions');

postcss([
	postcssCustomFunctions(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Functions] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssCustomFunctions({ preserve: true })
```

```css
@function --negative(--value) {
	result: calc(-1 * var(--value));
}

@function --double(--value) {
	result: calc(2 * var(--value));
}

html {
	--gap: 1em;
	padding: --negative(var(--gap));
	margin: --double(4px);
}

/* becomes */

@function --negative(--value) {
	result: calc(-1 * var(--value));
}

@function --double(--value) {
	result: calc(2 * var(--value));
}

html {--csstools-custom-function-0-arg-0: var(--gap);
}

html {
	--csstools-custom-function-0-result: calc(-1 * var(--csstools-custom-function-0-arg-0));
}

html {--csstools-custom-function-1-arg-0: 4px;
}

html {
	--csstools-custom-function-1-result: calc(2 * var(--csstools-custom-function-1-arg-0));
}

html {
	--gap: 1em;
	padding: var(--csstools-custom-function-0-result);
	padding: --negative(var(--gap));
	margin: var(--csstools-custom-function-1-result);
	margin: --double(4px);
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-custom-functions

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Functions]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-functions
[CSS Custom Functions and Mixins 1]: https://drafts.csswg.org/css-mixins-1/#function-rule
