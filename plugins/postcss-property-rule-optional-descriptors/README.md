# PostCSS Property Rule Optional Descriptors [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-property-rule-optional-descriptors.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/property-rule-optional-descriptors.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/property-rule-optional-descriptors.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-property-rule-optional-descriptors --save-dev
```

[PostCSS Property Rule Optional Descriptors] lets you omit optional descriptors in `@property` rules following the [CSS Houdini Specification].

```css
@property --foo {
	initial-value: "red";
}

@property --bar {
	syntax: "<color>";
	initial-value: "green";
}

/* becomes */

@property --foo {
	initial-value: "red";
	syntax: "*";
	inherits: true;
}

@property --bar {
	syntax: "<color>";
	initial-value: "green";
	inherits: true;
}
```

## Usage

Add [PostCSS Property Rule Optional Descriptors] to your project:

```bash
npm install postcss @csstools/postcss-property-rule-optional-descriptors --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPropertyRuleOptionalDescriptors = require('@csstools/postcss-property-rule-optional-descriptors');

postcss([
	postcssPropertyRuleOptionalDescriptors(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Property Rule Optional Descriptors] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#property-rule-optional-descriptors
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-property-rule-optional-descriptors

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Property Rule Optional Descriptors]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-property-rule-optional-descriptors
[CSS Houdini Specification]: https://drafts.css-houdini.org/css-properties-values-api/#determining-registration
