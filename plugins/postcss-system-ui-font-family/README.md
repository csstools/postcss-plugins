# PostCSS System UI Font Family [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-system-ui-font-family.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/system-ui-font-family.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/system-ui-font-family.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-system-ui-font-family --save-dev
```

[PostCSS System UI Font Family] lets you use the `system-ui` keyword following the [CSS Fonts 4 Specification].

```css
.foo {
	font: italic bold 12px/30px system-ui;
	font-family: system-ui;
	--font-family: system-ui;
}

/* becomes */

.foo {
	font: italic bold 12px/30px system-ui;
	font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
	--font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
}
```

## Usage

Add [PostCSS System UI Font Family] to your project:

```bash
npm install postcss @csstools/postcss-system-ui-font-family --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssSystemUIFontFamily = require('@csstools/postcss-system-ui-font-family');

postcss([
	postcssSystemUIFontFamily(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS System UI Font Family] runs in all Node environments, with special
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
postcssSystemUIFontFamily({ preserve: false })
```

```css
.foo {
	font: italic bold 12px/30px system-ui;
	font-family: system-ui;
	--font-family: system-ui;
}

/* becomes */

.foo {
	font: italic bold 12px/30px system-ui;
	font-family: -apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
	--font-family: -apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#system-ui-font-family
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-system-ui-font-family

[PostCSS]: https://github.com/postcss/postcss
[PostCSS System UI Font Family]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-system-ui-font-family
[CSS Fonts 4 Specification]: https://drafts.csswg.org/css-fonts-4/#system-ui-def
