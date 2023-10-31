# PostCSS Logical Overscroll Behavior [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-logical-overscroll-behavior.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/logical-overscroll-behavior.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install @csstools/postcss-logical-overscroll-behavior --save-dev
```

[PostCSS Logical Overscroll Behavior] lets you use `overscroll-behavior-inline` and `overscroll-behavior-block` properties following the [CSS Overscroll Specification].

```pcss
.inline {
	overscroll-behavior-inline: auto;
}

.block {
	overscroll-behavior-block: contain;
}

/* becomes */

.inline {
	overscroll-behavior-x: auto;
}

.block {
	overscroll-behavior-y: contain;
}
```

## Usage

Add [PostCSS Logical Overscroll Behavior] to your project:

```bash
npm install postcss @csstools/postcss-logical-overscroll-behavior --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssLogicalOverscrollBehavior = require('@csstools/postcss-logical-overscroll-behavior');

postcss([
	postcssLogicalOverscrollBehavior(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Logical Overscroll Behavior] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### inlineDirection

The `inlineDirection` option allows you to specify the direction of the inline axe. The default value is `left-to-right`, which would match any latin language.

**You should tweak this value so that it is specific to your language and writing mode.**

```js
postcssLogicalOverscrollBehavior({
	inlineDirection: 'top-to-bottom'
})
```

```pcss
.inline {
	overscroll-behavior-inline: auto;
}

.block {
	overscroll-behavior-block: contain;
}

/* becomes */

.inline {
	overscroll-behavior-y: auto;
}

.block {
	overscroll-behavior-x: contain;
}
```

Each direction must be one of the following:

- `top-to-bottom`
- `bottom-to-top`
- `left-to-right`
- `right-to-left`

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#logical-overscroll-behavior
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-logical-overscroll-behavior

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Logical Overscroll Behavior]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-logical-overscroll-behavior
[CSS Overscroll Specification]: https://www.w3.org/TR/css-overscroll-1/#overscroll-behavior-longhands-logical
