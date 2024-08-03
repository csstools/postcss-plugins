# PostCSS Bundler [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-bundler.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install @csstools/postcss-bundler --save-dev
```

[PostCSS Bundler] bundles your CSS.

This plugin pack contains :
- a bundler based on standard CSS `@import` statements.
- [a rebaser that rewrites URLs in your CSS.](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url)

`examples/example.css` :
```pcss
@import url("imports/basic.css");
@import url("node_modules:open-props/red");
```

`examples/imports/basic.css`:
```pcss
.foo {
	background: url('../../images/green.png');
}
```

when bundled :
```pcss
/* imports/basic.css */
.foo {
	background: url("../images/green.png");
}
/* node_modules:open-props/red */
:where(html){--red-0:#fff5f5;--red-1:#ffe3e3;--red-2:#ffc9c9;--red-3:#ffa8a8;--red-4:#ff8787;--red-5:#ff6b6b;--red-6:#fa5252;--red-7:#f03e3e;--red-8:#e03131;--red-9:#c92a2a;--red-10:#b02525;--red-11:#962020;--red-12:#7d1a1a}
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

## `postcss-import`

[`postcss-import`](https://github.com/postcss/postcss-import) is also a CSS bundler and parts of [PostCSS Bundler] are based on it.  
While creating this plugin we also submitted patches to [`postcss-import`](https://github.com/postcss/postcss-import) where possible.  

[PostCSS Bundler] is tuned differently and lacks configuration options that are present in [`postcss-import`](https://github.com/postcss/postcss-import).

[PostCSS Bundler] is intended to just work and to be a drop-in replacement for native CSS `@import` statements.

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-bundler

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Bundler]: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler
