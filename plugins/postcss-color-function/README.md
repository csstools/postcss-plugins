# PostCSS Color Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-color-function.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/color-function.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]


[PostCSS Color Function] lets you use the `color` function in
CSS, following the [CSS Color] specification.

```pcss
.color {
  color: color(display-p3 0.64331 0.19245 0.16771);
}

/* becomes */

.color {
  color: rgb(179,35,35);
}
```

## Usage

Add [PostCSS Color Function] to your project:

```bash
npm install postcss @csstools/postcss-color-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssColorFunction = require('@csstools/postcss-color-function');

postcss([
  postcssColorFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Color Function] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original functional color notation
is preserved. By default, it is not preserved.

```js
postcssColorFunction({ preserve: true })
```

```pcss
.color {
  color: color(display-p3 0.64331 0.19245 0.16771);
}

/* becomes */

.color {
  color: rgb(179,35,35);
  color: color(display-p3 0.64331 0.19245 0.16771);
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#color-function
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-color-function

[CSS Color]: https://www.w3.org/TR/css-color-4/#funcdef-color
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Color Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-function
