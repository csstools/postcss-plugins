# PostCSS Position Area Property [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-position-area-property.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/position-area-property.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/position-area-property.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-position-area-property --save-dev
```

[PostCSS Position Area Property] lets you fallback `position-area` to the alternate name `inset-area` following the [CSS Specification].

```css
.foo {
	position-area: start;
}

/* becomes */

.foo {
	inset-area: start;
	position-area: start;
}
```

## Usage

Add [PostCSS Position Area Property] to your project:

```bash
npm install postcss @csstools/postcss-position-area-property --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPositionAreaProperty = require('@csstools/postcss-position-area-property');

postcss([
	postcssPositionAreaProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Position Area Property] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#position-area-property
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-position-area-property

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Position Area Property]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-position-area-property
[CSS Specification]: https://drafts.csswg.org/css-anchor-position/#position-area
