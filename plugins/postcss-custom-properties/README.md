# PostCSS Custom Properties [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Properties] lets you use Custom Properties in CSS, following
the [CSS Custom Properties] specification.

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-variables.png)](https://caniuse.com/#feat=css-variables)

```pcss
:root {
	--color: red;
}

h1 {
	color: var(--color);
}

/* becomes */

:root {
	--color: red;
}

h1 {
	color: red;
	color: var(--color);
}
```

**Note:** This plugin only processes variables that are defined in the `:root` or `html` selector.

## Usage

Add [PostCSS Custom Properties] to your project:

```bash
npm install postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomProperties = require('postcss-custom-properties');

postcss([
	postcssCustomProperties(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Properties] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether properties using
custom properties should be preserved in their original form. By default these are preserved.

```js
postcssCustomProperties({
	preserve: false
});
```

```pcss
:root {
	--color: red;
}

h1 {
	color: var(--color);
}

/* becomes */

:root {
	--color: red;
}

h1 {
	color: red;
}
```

No Custom Properties will be removed from `:root` or `html` even when `preserve` is false.
It is impossible to know if a Custom Property is truly unused or only unused in the current stylesheet.

[cli-img]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg
[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-img]: https://cssdb.org/images/badges/custom-properties.svg
[css-url]: https://cssdb.org/#custom-properties
[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/postcss-custom-properties.svg
[npm-url]: https://www.npmjs.com/package/postcss-custom-properties

[CSS Custom Properties]: https://www.w3.org/TR/css-variables-1/
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Properties]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-properties
