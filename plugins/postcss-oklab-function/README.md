# PostCSS OKLab Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-oklab-function.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/oklab-function.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]


[PostCSS OKLab Function] lets you use `oklab` and `oklch` color functions in
CSS, following the [CSS Color] specification.

```pcss
:root {
	--firebrick: oklab(40% 0.234 0.39);
	--firebrick-a50: oklch(40% 0.234 0.39 / 50%);
}

/* becomes */

:root {
	--firebrick: color(display-p3 0.49890 0.00000 0.25954);
	--firebrick-a50: color(display-p3 0.49890 0.00000 0.25954 / 50%);
}
```

## Usage

Add [PostCSS OKLab Function] to your project:

```bash
npm install postcss @csstools/postcss-oklab-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssLabFunction = require('@csstools/postcss-oklab-function');

postcss([
  postcssOKLabFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS OKLab Function] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original functional color notation
is preserved. By default, it is not preserved.

```js
postcssOKLabFunction({ preserve: true })
```

```pcss
.color {
  color: oklab(65.125% -0.0320 0.1274);
}

/* becomes */

.color {
	color: color(display-p3 0.60930 0.57658 0.20615);
	color: oklab(65.125% -0.0320 0.1274);
}
```

## Copyright : color conversions

This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/tree/main/css-color-4. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#oklab-function
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-oklab-function

[CSS Color]: https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS OKLab Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-oklab-function
