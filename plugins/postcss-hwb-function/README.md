# PostCSS HWB Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-hwb-function.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/hwb-function.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/hwb-function.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-hwb-function --save-dev
```

[PostCSS HWB Function] lets you use the `hwb()` color function in CSS, following [CSS Color Module 4].

```pcss
a {
	color: hwb(194 0% 0%);
}

b {
	color: hwb(194 0% 0% / .5);
}

/* becomes */

a {
	color: rgb(0, 196, 255);
}

b {
	color: rgba(0, 196, 255, 0.5);
}
```

## Usage

Add [PostCSS HWB Function] to your project:

```bash
npm install postcss @csstools/postcss-hwb-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssHWBFunction = require('@csstools/postcss-hwb-function');

postcss([
	postcssHWBFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS HWB Function] runs in all Node environments, with special
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
postcssHWBFunction({ preserve: true })
```

```pcss
a {
	color: hwb(194 0% 0%);
}

b {
	color: hwb(194 0% 0% / .5);
}

/* becomes */

a {
	color: rgb(0, 196, 255);
	color: hwb(194 0% 0%);
}

b {
	color: rgba(0, 196, 255, 0.5);
	color: hwb(194 0% 0% / .5);
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#hwb-function
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-hwb-function

[PostCSS]: https://github.com/postcss/postcss
[PostCSS HWB Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-hwb-function
[CSS Color Module 4]: https://www.w3.org/TR/css-color-4/#the-hwb-notation
