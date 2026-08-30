# PostCSS Private Rule [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-private-rule.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/private-rule.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/private-rule.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-private-rule --save-dev
```

[PostCSS Private Rule] lets you declare private custom properties following the [CSS Mixins Specification].

```css
section {
	@private {
		--size: 2px;
	}

	&, & > h1 {
		border-width: var(--size);
	}
}

section > h1 {
	--size: 4px;
}

/* becomes */

section {
		--_csstools-p-15ccaace-0--size: 2px;

	&, & > h1 {
		border-width: var(--_csstools-p-15ccaace-0--size);
	}
}

section > h1 {
	--size: 4px;
}
```

## Usage

Add [PostCSS Private Rule] to your project:

```bash
npm install postcss @csstools/postcss-private-rule --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPrivateRule = require('@csstools/postcss-private-rule');

postcss([
	postcssPrivateRule(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Private Rule] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#private-rule
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-private-rule

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Private Rule]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-private-rule
[CSS Mixins Specification]: https://drafts.csswg.org/css-mixins-1/#private
