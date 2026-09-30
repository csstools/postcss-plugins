# PostCSS Container Rule Prelude List [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-container-rule-prelude-list.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/container-rule-prelude-list.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/container-rule-prelude-list.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-container-rule-prelude-list --save-dev
```

[PostCSS Container Rule Prelude List] lets you declare a list of container queries in a single `@container` rule following the [CSS Conditional 5 Specification].

```css
@container card (inline-size > 30em), style(--responsive: true) {
	a {
		color: red;
	}
}

/* becomes */

@container card (inline-size > 30em) {
	a {
		color: red;
	}
}
@container style(--responsive: true) {
	a {
		color: red;
	}
}
```

## Usage

Add [PostCSS Container Rule Prelude List] to your project:

```bash
npm install postcss @csstools/postcss-container-rule-prelude-list --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssContainerRulePreludeList = require('@csstools/postcss-container-rule-prelude-list');

postcss([
	postcssContainerRulePreludeList(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Container Rule Prelude List] runs in all Node environments, with special
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
postcssContainerRulePreludeList({ preserve: true })
```

```css
@container card (inline-size > 30em), style(--responsive: true) {
	a {
		color: red;
	}
}

/* becomes */

@container card (inline-size > 30em) {
	a {
		color: red;
	}
}
@container style(--responsive: true) {
	a {
		color: red;
	}
}
@container card (inline-size > 30em), style(--responsive: true) {
	a {
		color: red;
	}
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#container-rule-prelude-list
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-container-rule-prelude-list

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Container Rule Prelude List]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-container-rule-prelude-list
[CSS Conditional 5 Specification]: https://drafts.csswg.org/css-conditional-5/#container-rule
