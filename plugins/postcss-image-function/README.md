# PostCSS Image Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-image-function.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/image-function.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/image-function.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-image-function --save-dev
```

[PostCSS Image Function] lets you easily generate a solid-color image from any color following the [CSS Images 4 Specification].

```css
.foo {
	background-image: image(transparent);
}

.foo {
	--bg-image: image(transparent);
}

/* becomes */

.foo {
	background-image: linear-gradient(transparent,transparent);
}

.foo {
	--bg-image: linear-gradient(transparent,transparent);
}
```

## Usage

Add [PostCSS Image Function] to your project:

```bash
npm install postcss @csstools/postcss-image-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssImageFunction = require('@csstools/postcss-image-function');

postcss([
	postcssImageFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Image Function] runs in all Node environments, with special
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
postcssImageFunction({ preserve: true })
```

```css
.foo {
	background-image: image(transparent);
}

.foo {
	--bg-image: image(transparent);
}

/* becomes */

.foo {
	background-image: linear-gradient(transparent,transparent);
	background-image: image(transparent);
}

.foo {
	--bg-image: linear-gradient(transparent,transparent);
}

@supports (background-image: image(red)) {
.foo {
	--bg-image: image(transparent);
}
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#image-function
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-image-function

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Image Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-image-function
[CSS Images 4 Specification]: https://drafts.csswg.org/css-images-4/#funcdef-image
