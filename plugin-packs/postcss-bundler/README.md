# PostCSS Bundler [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-bundler.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Bundler] bundles your CSS without changing the way you write CSS.

This plugin pack contains : 
- [`postcss-import`](https://github.com/postcss/postcss-import)
- [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url)

It configures these plugins so that the default behavior is very similar to native CSS.

```pcss
/* test/examples/example.css */
@import url("imports/basic.css");

/* test/examples/imports/basic.css */
.foo {
	background: url('../../images/green.png');
}

/* becomes */

/* test/examples/example.expect.css */
.foo {
	background: url("./../images/green.png");
}
```

## Usage

Add [PostCSS Bundler] to your project:

```bash
npm install postcss @csstools/postcss-bundler --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBundler = require('@csstools/postcss-bundler');

postcss([
	postcssBundler(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Bundler] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-bundler

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Bundler]: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler
