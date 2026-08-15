# PostCSS Fit Tolerance Property [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-fit-tolerance-property.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/fit-tolerance-property.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/fit-tolerance-property.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-fit-tolerance-property --save-dev
```

[PostCSS Fit Tolerance Property] lets you use the `fit-tolerance` property following the [CSS Grid Specification].  
This initially shipped in some browser versions as `flow-tolerance`.

```css
.foo {
	fit-tolerance: 2em;
}

/* becomes */

.foo {
	flow-tolerance: 2em;
	fit-tolerance: 2em;
}
```

## Usage

Add [PostCSS Fit Tolerance Property] to your project:

```bash
npm install postcss @csstools/postcss-fit-tolerance-property --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFitToleranceProperty = require('@csstools/postcss-fit-tolerance-property');

postcss([
	postcssFitToleranceProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Fit Tolerance Property] runs in all Node environments, with special
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
is preserved. By default, it is preserved.

```js
postcssFitToleranceProperty({ preserve: false })
```

```css
.foo {
	fit-tolerance: 2em;
}

/* becomes */

.foo {
	flow-tolerance: 2em;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#fit-tolerance-property
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-fit-tolerance-property

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Fit Tolerance Property]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-fit-tolerance-property
[CSS Grid Specification]: https://drafts.csswg.org/css-grid-3/#placement-tolerance
