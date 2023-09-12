# PostCSS Global Data [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-global-data.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install @csstools/postcss-global-data --save-dev
```

[PostCSS Global Data] lets you inject CSS that is removed again before the final output. This is useful for  plugins that use global CSS as data.

For example, in the case of CSS Modules with [PostCSS Custom Media](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media), rules are usually not imported by every single file, so PostCSS Custom Media cannot generate fallbacks.
By providing a list of files, this plugin will inject the global CSS as data so that PostCSS Custom Media can generate fallbacks.

It is important that [PostCSS Global Data] is used before the plugin that actually needs the data.

Please note that [PostCSS Global Data] does not add anything to the output of your CSS. It only injects data into PostCSS so that other plugins
can actually use it.

## Usage

Add [PostCSS Global Data] to your project:

```bash
npm install postcss @csstools/postcss-global-data --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssGlobalData = require('@csstools/postcss-global-data');

postcss([
	postcssGlobalData(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Global Data] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### files

The `files` option determines which files to inject into PostCSS.

```js
postcssGlobalData({ 
	files: [
		'./src/css/variables.css',
		'./src/css/media-queries.css',
	],
});
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-global-data

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Global Data]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-global-data
