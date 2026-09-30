# PostCSS Syntax Descriptor Syntax Production [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-syntax-descriptor-syntax-production.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/syntax-descriptor-syntax-production.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/syntax-descriptor-syntax-production.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-syntax-descriptor-syntax-production --save-dev
```

[PostCSS Syntax Descriptor Syntax Production] lets you use the `<syntax>` production in `syntax` descriptors following the [CSS Specification].

```css
@property --color {
	inherits: true;
	initial-value: black;
	syntax: <color>;
}

/* becomes */

@property --color {
	inherits: true;
	initial-value: black;
	syntax: "<color>";
}
```

## Usage

Add [PostCSS Syntax Descriptor Syntax Production] to your project:

```bash
npm install postcss @csstools/postcss-syntax-descriptor-syntax-production --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssSyntaxDescriptorSyntaxProduction = require('@csstools/postcss-syntax-descriptor-syntax-production');

postcss([
	postcssSyntaxDescriptorSyntaxProduction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Syntax Descriptor Syntax Production] runs in all Node environments, with special
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
postcssSyntaxDescriptorSyntaxProduction({ preserve: true })
```

```css
@property --color {
	inherits: true;
	initial-value: black;
	syntax: <color>;
}

/* becomes */

@property --color {
	inherits: true;
	initial-value: black;
	syntax: "<color>";
	syntax: <color>;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#syntax-descriptor-syntax-production
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-syntax-descriptor-syntax-production

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Syntax Descriptor Syntax Production]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-syntax-descriptor-syntax-production
[CSS Specification]: https://github.com/w3c/csswg-drafts/issues/11426#issuecomment-3657538113
