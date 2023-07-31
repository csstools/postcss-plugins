# PostCSS Progressive Color Gamut [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-progressive-color-gamut.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/TODO.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Progressive Color Gamut] lets you easily create new plugins following some [CSS Specification].

```pcss
.foo {
	color: red;
}

.baz {
	color: green;
}

/* becomes */

.foo {
	color: blue;
}

.baz {
	color: green;
}
```

## Usage

Add [PostCSS Progressive Color Gamut] to your project:

```bash
npm install postcss @csstools/postcss-progressive-color-gamut --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBasePlugin = require('@csstools/postcss-progressive-color-gamut');

postcss([
	postcssBasePlugin(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Progressive Color Gamut] runs in all Node environments, with special
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
postcssBasePlugin({ preserve: true })
```

```pcss
.foo {
	color: red;
}

.baz {
	color: green;
}

/* becomes */

.foo {
	color: blue;
	color: red;
}

.baz {
	color: green;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#TODO
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-progressive-color-gamut

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Progressive Color Gamut]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-color-gamut
[CSS Specification]: #TODO
