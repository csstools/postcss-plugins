# PostCSS Has Pseudo [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/css-has-pseudo.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/has-pseudo-class.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Has Pseudo] lets you easily create new plugins following some [CSS Specification].

```pcss
h1:has(+ p) {
	margin-bottom: 1.5rem;
}

/* becomes */

[csstools-has-2w-1d-1m-2w-2p-37-14-17-w-34-15]:not(does-not-exist):not(does-not-exist) {
	margin-bottom: 1.5rem;
}
h1:has(+ p) {
	margin-bottom: 1.5rem;
}
```

## Usage

Add [PostCSS Has Pseudo] to your project:

```bash
npm install postcss css-has-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssHasPseudo = require('css-has-pseudo');

postcss([
	postcssHasPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Has Pseudo] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssHasPseudo({ preserve: true })
```

```pcss
h1:has(+ p) {
	margin-bottom: 1.5rem;
}

/* becomes */

[csstools-has-2w-1d-1m-2w-2p-37-14-17-w-34-15]:not(does-not-exist):not(does-not-exist) {
	margin-bottom: 1.5rem;
}
h1:has(+ p) {
	margin-bottom: 1.5rem;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#has-pseudo-class
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/css-has-pseudo

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo
[CSS Specification]: https://www.w3.org/TR/selectors-4/#has-pseudo
