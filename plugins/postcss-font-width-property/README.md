# PostCSS Font Width Property [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-font-width-property.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/font-width-property.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/font-width-property.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-font-width-property --save-dev
```

[PostCSS Font Width Property] lets you use the `font-width` property and descriptor follow the [CSS Fonts Specification].

```css
@font-face {
	src: url("foo.ttf");
	font-family: "foo";
	font-style: normal;
	font-width: 1% 1000%;
}

.foo {
	font-width: 50%;
}

/* becomes */

@font-face {
	src: url("foo.ttf");
	font-family: "foo";
	font-style: normal;
	font-stretch: 1% 1000%;
}

.foo {
	font-stretch: 50%;
}
```

## Usage

Add [PostCSS Font Width Property] to your project:

```bash
npm install postcss @csstools/postcss-font-width-property --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFontWidthProperty = require('@csstools/postcss-font-width-property');

postcss([
	postcssFontWidthProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Font Width Property] runs in all Node environments, with special
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
postcssFontWidthProperty({ preserve: true })
```

```css
@font-face {
	src: url("foo.ttf");
	font-family: "foo";
	font-style: normal;
	font-width: 1% 1000%;
}

.foo {
	font-width: 50%;
}

/* becomes */

@font-face {
	src: url("foo.ttf");
	font-family: "foo";
	font-style: normal;
	font-stretch: 1% 1000%;
	font-width: 1% 1000%;
}

.foo {
	font-stretch: 50%;
	font-width: 50%;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#font-width-property
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-font-width-property

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Font Width Property]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-font-width-property
[CSS Fonts Specification]: https://drafts.csswg.org/css-fonts/#font-stretch-prop
