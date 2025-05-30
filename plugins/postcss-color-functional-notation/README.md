# PostCSS Color Functional Notation [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-color-functional-notation.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/color-functional-notation.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/color-functional-notation.svg" height="20">][css-url] 

```bash
npm install postcss-color-functional-notation --save-dev
```

[PostCSS Color Functional Notation] lets you use space and slash separated
color notation in CSS, following the [CSS Color] specification.

```css
:root {
	--firebrick: rgb(178 34 34);
	--firebrick-a50: rgb(70% 13.5% 13.5% / 50%);
	--firebrick-hsl: hsla(0 68% 42%);
	--firebrick-hsl-a50: hsl(0 68% 42% / 50%);
}

/* becomes */

:root {
	--firebrick: rgb(178, 34, 34);
	--firebrick-a50: rgba(179, 34, 34, 0.5);
	--firebrick-hsl: hsl(0, 68%, 42%);
	--firebrick-hsl-a50: hsla(0, 68%, 42%, 0.5);
}
```

## Usage

Add [PostCSS Color Functional Notation] to your project:

```bash
npm install postcss postcss-color-functional-notation --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

postcss([
	postcssColorFunctionalNotation(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Color Functional Notation] runs in all Node environments, with special
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
postcssColorFunctionalNotation({ preserve: true })
```

```css
:root {
	--firebrick: rgb(178 34 34);
	--firebrick-a50: rgb(70% 13.5% 13.5% / 50%);
	--firebrick-hsl: hsla(0 68% 42%);
	--firebrick-hsl-a50: hsl(0 68% 42% / 50%);
}

/* becomes */

:root {
	--firebrick: rgb(178, 34, 34);
	--firebrick-a50: rgba(179, 34, 34, 0.5);
	--firebrick-hsl: hsl(0, 68%, 42%);
	--firebrick-hsl: hsla(0 68% 42%);
	--firebrick-hsl-a50: hsla(0, 68%, 42%, 0.5);
}

@supports (color: rgb(0 0 0 / 0)) {
:root {
	--firebrick: rgb(178 34 34);
	--firebrick-a50: rgb(70% 13.5% 13.5% / 50%);
}
}

@supports (color: hsl(0 0% 0% / 0)) {
:root {
	--firebrick-hsl-a50: hsl(0 68% 42% / 50%);
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
postcssColorFunctionalNotation({ enableProgressiveCustomProperties: false })
```

```css
:root {
	--firebrick: rgb(178 34 34);
	--firebrick-a50: rgb(70% 13.5% 13.5% / 50%);
	--firebrick-hsl: hsla(0 68% 42%);
	--firebrick-hsl-a50: hsl(0 68% 42% / 50%);
}

/* becomes */

:root {
	--firebrick: rgb(178, 34, 34);
	--firebrick: rgb(178 34 34);
	--firebrick-a50: rgba(179, 34, 34, 0.5);
	--firebrick-a50: rgb(70% 13.5% 13.5% / 50%);
	--firebrick-hsl: hsl(0, 68%, 42%);
	--firebrick-hsl: hsla(0 68% 42%);
	--firebrick-hsl-a50: hsla(0, 68%, 42%, 0.5);
	--firebrick-hsl-a50: hsl(0 68% 42% / 50%);
}
```

_Custom properties do not fallback to the previous declaration_

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#color-functional-notation
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-color-functional-notation

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Color Functional Notation]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-functional-notation
[CSS Color]: https://www.w3.org/TR/css-color-4/#funcdef-rgb
