# PostCSS Color Mix Variadic Function Arguments [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-color-mix-variadic-function-arguments.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/color-mix-variadic-function-arguments.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/color-mix-variadic-function-arguments.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

[PostCSS Color Mix Variadic Function Arguments] lets you use the `color-mix()` function with any number of arguments following the [CSS Color 5 Specification].

```css
.red {
	color: color-mix(in srgb, red);
}

.grey {
	color: color-mix(in srgb, red, lime, blue);
}

/* becomes */

.red {
	color: rgb(255, 0, 0);
}

.grey {
	color: rgb(85, 85, 85);
}
```

> [!NOTE]
> We can not dynamically resolve `var()` arguments in `color-mix()`, only static values will work.

## Usage

Add [PostCSS Color Mix Variadic Function Arguments] to your project:

```bash
npm install postcss @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssColorMixVariadicFunctionArguments = require('@csstools/postcss-color-mix-variadic-function-arguments');

postcss([
	postcssColorMixVariadicFunctionArguments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Color Mix Variadic Function Arguments] runs in all Node environments, with special
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
postcssColorMixVariadicFunctionArguments({ preserve: true })
```

```css
.red {
	color: color-mix(in srgb, red);
}

.grey {
	color: color-mix(in srgb, red, lime, blue);
}

/* becomes */

.red {
	color: rgb(255, 0, 0);
	color: color-mix(in srgb, red);
}

.grey {
	color: rgb(85, 85, 85);
	color: color-mix(in srgb, red, lime, blue);
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#color-mix-variadic-function-arguments
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-color-mix-variadic-function-arguments

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Color Mix Variadic Function Arguments]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-mix-variadic-function-arguments
[CSS Color 5 Specification]: https://www.w3.org/TR/css-color-5/#color-mix
