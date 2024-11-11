# PostCSS Random Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-random-function.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/random-function.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/random-function.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-random-function --save-dev
```

[PostCSS Random Function] lets you use the `random` function, following the [CSS Values 5] specification.

```css
div {
	color: oklch(0.7, 0.2, random(120deg, 240deg));
}

div {
	color: oklch(0.7, 0.2, random(120deg, 240deg, by 7deg));
}

div {
	color: oklch(0.7, 0.2, random(--text, 120deg, 240deg));
	border-color: oklch(0.7, 0.2, random(--border, 120deg, 240deg));
}

/* becomes */

div {
	color: oklch(0.7, 0.2, 238.66036deg);
}

div {
	color: oklch(0.7, 0.2, 134deg);
}

div {
	color: oklch(0.7, 0.2, 226.47057deg);
	border-color: oklch(0.7, 0.2, 157.76966deg);
}
```

> [!NOTE]
> Generated values are deterministic pseudo random numbers.
> Generating values twice with the same input will give the same result.
> The input length of the CSS source file is used as a random seed.

## Usage

Add [PostCSS Random Function] to your project:

```bash
npm install postcss @csstools/postcss-random-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssRandomFunction = require('@csstools/postcss-random-function');

postcss([
	postcssRandomFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Random Function] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## ⚠️ About custom properties

Given the dynamic nature of custom properties it's impossible to know what the variable value is, which means the plugin can't compute a final value for the stylesheet. 

Because of that, any usage that contains a `var` is skipped.

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssRandomFunction({ preserve: true })
```

```css
div {
	color: oklch(0.7, 0.2, random(120deg, 240deg));
}

div {
	color: oklch(0.7, 0.2, random(120deg, 240deg, by 7deg));
}

div {
	color: oklch(0.7, 0.2, random(--text, 120deg, 240deg));
	border-color: oklch(0.7, 0.2, random(--border, 120deg, 240deg));
}

/* becomes */

div {
	color: oklch(0.7, 0.2, 238.66036deg);
	color: oklch(0.7, 0.2, random(120deg, 240deg));
}

div {
	color: oklch(0.7, 0.2, 134deg);
	color: oklch(0.7, 0.2, random(120deg, 240deg, by 7deg));
}

div {
	color: oklch(0.7, 0.2, 226.47057deg);
	color: oklch(0.7, 0.2, random(--text, 120deg, 240deg));
	border-color: oklch(0.7, 0.2, 157.76966deg);
	border-color: oklch(0.7, 0.2, random(--border, 120deg, 240deg));
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#random-function
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-random-function

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Random Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-random-function
[CSS Values 5]: https://drafts.csswg.org/css-values-5/#random
