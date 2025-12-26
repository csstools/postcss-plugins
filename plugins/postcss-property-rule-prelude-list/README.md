# PostCSS Property Rule Prelude List [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-property-rule-prelude-list.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/property-rule-prelude-list.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/property-rule-prelude-list.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-property-rule-prelude-list --save-dev
```

[PostCSS Property Rule Prelude List] lets you declare a list of custom properties in a single `@property` rule following the [CSS Specification].

```css
@property --color-a, --color-b {
	inherits: true;
	initial-value: black;
	syntax: "<color>";
}

/* becomes */

@property --color-a {
	inherits: true;
	initial-value: black;
	syntax: "<color>";
}
@property --color-b {
	inherits: true;
	initial-value: black;
	syntax: "<color>";
}
```

## Usage

Add [PostCSS Property Rule Prelude List] to your project:

```bash
npm install postcss @csstools/postcss-property-rule-prelude-list --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPropertyRulePreludeList = require('@csstools/postcss-property-rule-prelude-list');

postcss([
	postcssPropertyRulePreludeList(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Property Rule Prelude List] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#property-rule-prelude-list
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-property-rule-prelude-list

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Property Rule Prelude List]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-property-rule-prelude-list
[CSS Specification]: https://github.com/w3c/csswg-drafts/issues/7523#issuecomment-3683970305
