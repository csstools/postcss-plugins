# PostCSS Light Dark Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-light-dark-function.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/light-dark-function.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/light-dark-function.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-light-dark-function --save-dev
```

[PostCSS Light Dark Function] lets you use the `light-dark` color function in
CSS, following the [CSS Color 5 Specification].

```pcss
.dark {
	color-scheme: dark;
}

.light {
	color-scheme: light;
}

.theme {
	color: light-dark(pink, magenta);
}

.prop {
	--theme-color: light-dark(cyan, deepskyblue);
}

/* becomes */

.dark {
	--csstools-color-scheme--light:  ;
	--csstools-color-scheme--dark: initial;
	color-scheme: dark;
}

.light {
	--csstools-color-scheme--light: initial;
	--csstools-color-scheme--dark:  ;
	color-scheme: light;
}

.theme {
	color: var(--csstools-color-scheme--light, pink) var(--csstools-color-scheme--dark, magenta);
	color: light-dark(pink, magenta);
}

.prop {
	--theme-color: var(--csstools-color-scheme--light, cyan) var(--csstools-color-scheme--dark, deepskyblue);
	& * {
	--theme-color: var(--csstools-color-scheme--light, cyan) var(--csstools-color-scheme--dark, deepskyblue);
	}
}

@supports (color: light-dark(red, red)) {
.prop {
	--theme-color: light-dark(cyan, deepskyblue);
}
}

:root {
	--csstools-color-scheme--light: initial;
	--csstools-color-scheme--dark:  ;
}

@media (prefers-color-scheme: dark) {

	:root {
		--csstools-color-scheme--light:  ;
		--csstools-color-scheme--dark: initial;
	}
}
```

## Usage

Add [PostCSS Light Dark Function] to your project:

```bash
npm install postcss @csstools/postcss-light-dark-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssLightDarkFunction = require('@csstools/postcss-light-dark-function');

postcss([
	postcssLightDarkFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Light Dark Function] runs in all Node environments, with special
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
postcssLightDarkFunction({ preserve: false })
```

```pcss
.dark {
	color-scheme: dark;
}

.light {
	color-scheme: light;
}

.theme {
	color: light-dark(pink, magenta);
}

.prop {
	--theme-color: light-dark(cyan, deepskyblue);
}

/* becomes */

.dark {
	--csstools-color-scheme--light:  ;
	--csstools-color-scheme--dark: initial;
	color-scheme: dark;
}

.light {
	--csstools-color-scheme--light: initial;
	--csstools-color-scheme--dark:  ;
	color-scheme: light;
}

.theme {
	color: var(--csstools-color-scheme--light, pink) var(--csstools-color-scheme--dark, magenta);
}

.prop {
	--theme-color: var(--csstools-color-scheme--light, cyan) var(--csstools-color-scheme--dark, deepskyblue);
	& * {
	--theme-color: var(--csstools-color-scheme--light, cyan) var(--csstools-color-scheme--dark, deepskyblue);
	}
}

:root {
	--csstools-color-scheme--light: initial;
	--csstools-color-scheme--dark:  ;
}

@media (prefers-color-scheme: dark) {

	:root {
		--csstools-color-scheme--light:  ;
		--csstools-color-scheme--dark: initial;
	}
}
```

### enableProgressiveCustomProperties

The `enableProgressiveCustomProperties` option determines whether the original notation
is wrapped with `@supports` when used in Custom Properties. By default, it is enabled.

> [!NOTE]
> We only recommend disabling this when you set `preserve` to `false` or if you bring your own fix for Custom Properties.  
> See what the plugin does in its [README](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties#readme).

```js
postcssLightDarkFunction({ enableProgressiveCustomProperties: false })
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#light-dark-function
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-light-dark-function

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Light Dark Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-light-dark-function
[CSS Color 5 Specification]: https://drafts.csswg.org/css-color-5/#light-dark
