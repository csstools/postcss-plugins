# PostCSS Gradient Stop Increments [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-gradient-stop-increments-experimental.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

[PostCSS Gradient Stop Increments] lets you increment gradient stops following the [CSSWG 8616 proposal].

```css
.example-1 {
	background: linear-gradient(red 50%, blue ++1px);
}

.example-2 {
	background: conic-gradient(red ++60deg, blue ++10deg ++50deg, green ++60deg, yellow ++60deg);
}

.example-3 {
	background: conic-gradient(pink ++60deg, cyan 0 ++20deg, gold 0 ++10deg);
}

.example-4 {
	background: linear-gradient(orange 20px, magenta 2vi, aqua ++2vw);
}

/* becomes */

.example-1 {
	background: linear-gradient(red 50%, blue calc(50% + +1px));
}

.example-2 {
	background: conic-gradient(red +60deg, blue 70deg 120deg, green 180deg, yellow 240deg);
}

.example-3 {
	background: conic-gradient(pink +60deg, cyan 0 80deg, gold 0 90deg);
}

.example-4 {
	background: linear-gradient(orange 20px, magenta 2vi, aqua calc(max(20px, 2vi) + +2vw));
}
```

## Usage

Add [PostCSS Gradient Stop Increments] to your project:

```bash
npm install postcss @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssGradientStopIncrementsExperimental = require('@csstools/postcss-gradient-stop-increments-experimental');

postcss([
	postcssGradientStopIncrementsExperimental(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Gradient Stop Increments] runs in all Node environments, with special
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
postcssGradientStopIncrementsExperimental({ preserve: true })
```

```css
.example-1 {
	background: linear-gradient(red 50%, blue ++1px);
}

.example-2 {
	background: conic-gradient(red ++60deg, blue ++10deg ++50deg, green ++60deg, yellow ++60deg);
}

.example-3 {
	background: conic-gradient(pink ++60deg, cyan 0 ++20deg, gold 0 ++10deg);
}

.example-4 {
	background: linear-gradient(orange 20px, magenta 2vi, aqua ++2vw);
}

/* becomes */

.example-1 {
	background: linear-gradient(red 50%, blue calc(50% + +1px));
	background: linear-gradient(red 50%, blue ++1px);
}

.example-2 {
	background: conic-gradient(red +60deg, blue 70deg 120deg, green 180deg, yellow 240deg);
	background: conic-gradient(red ++60deg, blue ++10deg ++50deg, green ++60deg, yellow ++60deg);
}

.example-3 {
	background: conic-gradient(pink +60deg, cyan 0 80deg, gold 0 90deg);
	background: conic-gradient(pink ++60deg, cyan 0 ++20deg, gold 0 ++10deg);
}

.example-4 {
	background: linear-gradient(orange 20px, magenta 2vi, aqua calc(max(20px, 2vi) + +2vw));
	background: linear-gradient(orange 20px, magenta 2vi, aqua ++2vw);
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-gradient-stop-increments-experimental

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Gradient Stop Increments]: https://github.com/csstools/postcss-plugins/tree/main/experimental/postcss-gradient-stop-increments
[CSSWG 8616 proposal]: https://github.com/w3c/csswg-drafts/issues/8616
