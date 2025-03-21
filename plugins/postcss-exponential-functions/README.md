# PostCSS Exponential Functions [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-exponential-functions.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/exponential-functions.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/exponential-functions.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-exponential-functions --save-dev
```

[PostCSS Exponential Functions] lets you use the `pow()`, `sqrt()`, `hypot()`, `log()`, `exp()` functions following the [CSS Values 4 Specification].

```css
.foo {
	top: calc(1px * pow(2, 3));
	line-height: sqrt(1.2);
	padding: hypot(3px, 4px);
	order: log(10, 10);
	min-height: calc(e - exp(1));
}

/* becomes */

.foo {
	top: 8px;
	line-height: 1.0954451150103;
	padding: 5px;
	order: 1;
	min-height: 0;
}
```

## Usage

Add [PostCSS Exponential Functions] to your project:

```bash
npm install postcss @csstools/postcss-exponential-functions --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssExponentialFunctions = require('@csstools/postcss-exponential-functions');

postcss([
	postcssExponentialFunctions(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Exponential Functions] runs in all Node environments, with special
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
postcssExponentialFunctions({ preserve: true })
```

```css
.foo {
	top: calc(1px * pow(2, 3));
	line-height: sqrt(1.2);
	padding: hypot(3px, 4px);
	order: log(10, 10);
	min-height: calc(e - exp(1));
}

/* becomes */

.foo {
	top: 8px;
	top: calc(1px * pow(2, 3));
	line-height: 1.0954451150103;
	line-height: sqrt(1.2);
	padding: 5px;
	padding: hypot(3px, 4px);
	order: 1;
	order: log(10, 10);
	min-height: 0;
	min-height: calc(e - exp(1));
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#exponential-functions
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-exponential-functions

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Exponential Functions]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-exponential-functions
[CSS Values 4 Specification]: https://www.w3.org/TR/css-values-4/#exponent-funcs
