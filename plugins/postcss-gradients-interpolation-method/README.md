# PostCSS Gradients Interpolation Method [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-gradients-interpolation-method.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/TODO.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Gradients Interpolation Method] lets you use different interpolation methods in CSS gradient functions following [CSS Specification].

```pcss
.oklch {
	background: linear-gradient(in oklch 90deg, black 25% , blue 75%);
}

:root {
	--background: linear-gradient(in oklch 90deg, black 25%, blue 75%);
}

/* becomes */

.oklch {
	background: linear-gradient(90deg ,black 25%,color-mix(in oklch, black 90%, blue 10%) calc(25% + ((75% - 25%) * 0.1)),color-mix(in oklch, black 80%, blue 20%) calc(25% + ((75% - 25%) * 0.2)),color-mix(in oklch, black 70%, blue 30%) calc(25% + ((75% - 25%) * 0.3)),color-mix(in oklch, black 60%, blue 40%) calc(25% + ((75% - 25%) * 0.4)),color-mix(in oklch, black 50%, blue 50%) calc(25% + ((75% - 25%) * 0.5)),color-mix(in oklch, black 40%, blue 60%) calc(25% + ((75% - 25%) * 0.6)),color-mix(in oklch, black 30%, blue 70%) calc(25% + ((75% - 25%) * 0.7)),color-mix(in oklch, black 20%, blue 80%) calc(25% + ((75% - 25%) * 0.8)),color-mix(in oklch, black 10%, blue 90%) calc(25% + ((75% - 25%) * 0.9)),blue 75%);
	background: linear-gradient(in oklch 90deg, black 25% , blue 75%);
}

:root {
	--background: linear-gradient(90deg ,black 25%,color-mix(in oklch, black 90%, blue 10%) calc(25% + ((75% - 25%) * 0.1)),color-mix(in oklch, black 80%, blue 20%) calc(25% + ((75% - 25%) * 0.2)),color-mix(in oklch, black 70%, blue 30%) calc(25% + ((75% - 25%) * 0.3)),color-mix(in oklch, black 60%, blue 40%) calc(25% + ((75% - 25%) * 0.4)),color-mix(in oklch, black 50%, blue 50%) calc(25% + ((75% - 25%) * 0.5)),color-mix(in oklch, black 40%, blue 60%) calc(25% + ((75% - 25%) * 0.6)),color-mix(in oklch, black 30%, blue 70%) calc(25% + ((75% - 25%) * 0.7)),color-mix(in oklch, black 20%, blue 80%) calc(25% + ((75% - 25%) * 0.8)),color-mix(in oklch, black 10%, blue 90%) calc(25% + ((75% - 25%) * 0.9)),blue 75%);
}

@supports (background: linear-gradient(in oklch, red 0%, red 0% 1%, red 2%)) {
:root {
	--background: linear-gradient(in oklch 90deg, black 25%, blue 75%);
}
}
```

## Warnings

⚠️ This plugin assumes you have a separate plugin to transform `color-mix()` to something older browsers can understand.

⚠️ Color stops with only a color and Interpolation hints are not supported.
We can not statically check if a certain value is a single color or an interpolation hint.

These are equivalent in PostCSS :

```pcss
	--red: red;
	/* Color stop variable */
	background-image: linear-gradient(90deg, black, var(--red), blue);

	--perc-10: 10%;
	/* Interpolation hint */
	background-image: linear-gradient(90deg, black, var(--perc-10), blue);
```

## Usage

Add [PostCSS Gradients Interpolation Method] to your project:

```bash
npm install postcss @csstools/postcss-gradients-interpolation-method --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssGradientsInterpolationMethod = require('@csstools/postcss-gradients-interpolation-method');

postcss([
	postcssGradientsInterpolationMethod(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Gradients Interpolation Method] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Create React App](INSTALL.md#create-react-app)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssGradientsInterpolationMethod({ preserve: true })
```

```pcss
.oklch {
	background: linear-gradient(in oklch 90deg, black 25% , blue 75%);
}

:root {
	--background: linear-gradient(in oklch 90deg, black 25%, blue 75%);
}

/* becomes */

.oklch {
	background: linear-gradient(90deg ,black 25%,color-mix(in oklch, black 90%, blue 10%) calc(25% + ((75% - 25%) * 0.1)),color-mix(in oklch, black 80%, blue 20%) calc(25% + ((75% - 25%) * 0.2)),color-mix(in oklch, black 70%, blue 30%) calc(25% + ((75% - 25%) * 0.3)),color-mix(in oklch, black 60%, blue 40%) calc(25% + ((75% - 25%) * 0.4)),color-mix(in oklch, black 50%, blue 50%) calc(25% + ((75% - 25%) * 0.5)),color-mix(in oklch, black 40%, blue 60%) calc(25% + ((75% - 25%) * 0.6)),color-mix(in oklch, black 30%, blue 70%) calc(25% + ((75% - 25%) * 0.7)),color-mix(in oklch, black 20%, blue 80%) calc(25% + ((75% - 25%) * 0.8)),color-mix(in oklch, black 10%, blue 90%) calc(25% + ((75% - 25%) * 0.9)),blue 75%);
	background: linear-gradient(in oklch 90deg, black 25% , blue 75%);
}

:root {
	--background: linear-gradient(90deg ,black 25%,color-mix(in oklch, black 90%, blue 10%) calc(25% + ((75% - 25%) * 0.1)),color-mix(in oklch, black 80%, blue 20%) calc(25% + ((75% - 25%) * 0.2)),color-mix(in oklch, black 70%, blue 30%) calc(25% + ((75% - 25%) * 0.3)),color-mix(in oklch, black 60%, blue 40%) calc(25% + ((75% - 25%) * 0.4)),color-mix(in oklch, black 50%, blue 50%) calc(25% + ((75% - 25%) * 0.5)),color-mix(in oklch, black 40%, blue 60%) calc(25% + ((75% - 25%) * 0.6)),color-mix(in oklch, black 30%, blue 70%) calc(25% + ((75% - 25%) * 0.7)),color-mix(in oklch, black 20%, blue 80%) calc(25% + ((75% - 25%) * 0.8)),color-mix(in oklch, black 10%, blue 90%) calc(25% + ((75% - 25%) * 0.9)),blue 75%);
}

@supports (background: linear-gradient(in oklch, red 0%, red 0% 1%, red 2%)) {
:root {
	--background: linear-gradient(in oklch 90deg, black 25%, blue 75%);
}
}
```

### enableProgressiveCustomProperties

The `enableProgressiveCustomProperties` option determines whether the original notation
is wrapped with `@supports` when used in Custom Properties. By default, it is enabled.

⚠️ We only recommend disabling this when you set `preserve` to `false` or if you bring your own fix for Custom Properties. See what the plugin does in its [README](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties#readme).

```js
postcssGradientsInterpolationMethod({ enableProgressiveCustomProperties: false })
```

```pcss
.oklch {
	background: linear-gradient(in oklch 90deg, black 25% , blue 75%);
}

:root {
	--background: linear-gradient(in oklch 90deg, black 25%, blue 75%);
}

/* becomes */

.oklch {
	background: linear-gradient(90deg ,black 25%,color-mix(in oklch, black 90%, blue 10%) calc(25% + ((75% - 25%) * 0.1)),color-mix(in oklch, black 80%, blue 20%) calc(25% + ((75% - 25%) * 0.2)),color-mix(in oklch, black 70%, blue 30%) calc(25% + ((75% - 25%) * 0.3)),color-mix(in oklch, black 60%, blue 40%) calc(25% + ((75% - 25%) * 0.4)),color-mix(in oklch, black 50%, blue 50%) calc(25% + ((75% - 25%) * 0.5)),color-mix(in oklch, black 40%, blue 60%) calc(25% + ((75% - 25%) * 0.6)),color-mix(in oklch, black 30%, blue 70%) calc(25% + ((75% - 25%) * 0.7)),color-mix(in oklch, black 20%, blue 80%) calc(25% + ((75% - 25%) * 0.8)),color-mix(in oklch, black 10%, blue 90%) calc(25% + ((75% - 25%) * 0.9)),blue 75%);
	background: linear-gradient(in oklch 90deg, black 25% , blue 75%);
}

:root {
	--background: linear-gradient(90deg ,black 25%,color-mix(in oklch, black 90%, blue 10%) calc(25% + ((75% - 25%) * 0.1)),color-mix(in oklch, black 80%, blue 20%) calc(25% + ((75% - 25%) * 0.2)),color-mix(in oklch, black 70%, blue 30%) calc(25% + ((75% - 25%) * 0.3)),color-mix(in oklch, black 60%, blue 40%) calc(25% + ((75% - 25%) * 0.4)),color-mix(in oklch, black 50%, blue 50%) calc(25% + ((75% - 25%) * 0.5)),color-mix(in oklch, black 40%, blue 60%) calc(25% + ((75% - 25%) * 0.6)),color-mix(in oklch, black 30%, blue 70%) calc(25% + ((75% - 25%) * 0.7)),color-mix(in oklch, black 20%, blue 80%) calc(25% + ((75% - 25%) * 0.8)),color-mix(in oklch, black 10%, blue 90%) calc(25% + ((75% - 25%) * 0.9)),blue 75%);
	--background: linear-gradient(in oklch 90deg, black 25%, blue 75%);
}
```

_Custom properties do not fallback to the previous declaration_

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#TODO
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-gradients-interpolation-method

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Gradients Interpolation Method]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-gradients-interpolation-method
[CSS Specification]: https://drafts.csswg.org/css-images-4/#linear-gradients
