# PostCSS Mixins [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-mixins.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/mixins.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/mixins.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-mixins --save-dev
```

[PostCSS Mixins] lets you use `@mixin` and `@apply` following [CSS Mixins 1].

Several specification aspects of CSS Mixins still need to be settled.  
This plugin is only a partial implementation to avoid conflicts with the final specification.

Unsupported:
- mixin arguments
- `@contents` blocks
- `@result` blocks
- layered `@mixin` declarations
- mixin overrides

```css
@mixin --foo() {
	color: green;
}

.foo {
	@apply --foo;
}

/* becomes */

.foo {
	color: green;
}
```

## Usage

Add [PostCSS Mixins] to your project:

```bash
npm install postcss @csstools/postcss-mixins --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssMixins = require('@csstools/postcss-mixins');

postcss([
	postcssMixins(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Mixins] runs in all Node environments, with special
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
postcssMixins({ preserve: true })
```

```css
@mixin --foo() {
	color: green;
}

.foo {
	@apply --foo;
}

/* becomes */

@mixin --foo() {
	color: green;
}

.foo {
	color: green;
	@apply --foo;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#mixins
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-mixins

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Mixins]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-mixins
[CSS Mixins 1]: https://drafts.csswg.org/css-mixins/#contents-rule
