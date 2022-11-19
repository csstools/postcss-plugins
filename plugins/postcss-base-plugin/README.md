# PostCSS Base Plugin [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-base-plugin.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/TODO.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Base Plugin] lets you easily create new plugins following some [CSS Specification].

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

Add [PostCSS Base Plugin] to your project:

```bash
npm install postcss @csstools/postcss-base-plugin --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBasePlugin = require('@csstools/postcss-base-plugin');

postcss([
	postcssBasePlugin(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Base Plugin] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Create React App](INSTALL.md#create-react-app)
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
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-base-plugin

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Base Plugin]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-base-plugin
[CSS Specification]: #TODO
