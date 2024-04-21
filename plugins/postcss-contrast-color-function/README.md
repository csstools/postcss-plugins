# PostCSS Contrast Color Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-contrast-color-function.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/contrast-color-function.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/contrast-color-function.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-contrast-color-function --save-dev
```

[PostCSS Contrast Color Function] lets you dynamically specify a text color with adequate contrast following the [CSS Color 5 Specification].

```pcss
.dynamic {
	color: contrast-color(oklch(82% 0.2 330));
}

.max {
	color: contrast-color(oklch(30% 0.2 79) max);
}

/* becomes */

.dynamic {
	color: color(display-p3 0.15433 0 0.15992);
	color: contrast-color(oklch(82% 0.2 330));
}@supports not (color: contrast-color(red max)) {@media (prefers-contrast: more) {.dynamic {
	color: rgb(0, 0, 0);
}
	}
}@supports not (color: contrast-color(red max)) {@media (prefers-contrast: less) {.dynamic {
	color: color(display-p3 0.2925 0 0.30177);
}
	}
}

.max {
	color: rgb(255, 255, 255);
	color: contrast-color(oklch(30% 0.2 79) max);
}
```

## Usage

Add [PostCSS Contrast Color Function] to your project:

```bash
npm install postcss @csstools/postcss-contrast-color-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssContrastColorFunction = require('@csstools/postcss-contrast-color-function');

postcss([
	postcssContrastColorFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Contrast Color Function] runs in all Node environments, with special
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
postcssContrastColorFunction({ preserve: false })
```

```pcss
.dynamic {
	color: contrast-color(oklch(82% 0.2 330));
}

.max {
	color: contrast-color(oklch(30% 0.2 79) max);
}

/* becomes */

.dynamic {
	color: color(display-p3 0.15433 0 0.15992);
}@media (prefers-contrast: more) {.dynamic {
	color: rgb(0, 0, 0);
}
}@media (prefers-contrast: less) {.dynamic {
	color: color(display-p3 0.2925 0 0.30177);
}
}

.max {
	color: rgb(255, 255, 255);
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#contrast-color-function
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-contrast-color-function

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Contrast Color Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-contrast-color-function
[CSS Color 5 Specification]: https://drafts.csswg.org/css-color-5/#contrast-color
