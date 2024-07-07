# PostCSS Content Alt Text [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-content-alt-text.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/content-alt-text.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/content-alt-text.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-content-alt-text --save-dev
```

[PostCSS Content Alt Text] generates fallback values for `content` with alt text following the [CSS Generated Content Module].

```pcss
.foo {
	content: url(tree.jpg) / "A beautiful tree in a dark forest";
}

/* becomes */

.foo {
	content: url(tree.jpg)  "A beautiful tree in a dark forest";
	content: url(tree.jpg) / "A beautiful tree in a dark forest";
}
```

## Usage

Add [PostCSS Content Alt Text] to your project:

```bash
npm install postcss @csstools/postcss-content-alt-text --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssContentAltText = require('@csstools/postcss-content-alt-text');

postcss([
	postcssContentAltText(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Content Alt Text] runs in all Node environments, with special
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
postcssContentAltText({ preserve: false })
```

```pcss
.foo {
	content: url(tree.jpg) / "A beautiful tree in a dark forest";
}

/* becomes */

.foo {
	content: url(tree.jpg)  "A beautiful tree in a dark forest";
}
```

### stripAltText

The `stripAltText` option determines whether the alt text is removed from the value.  
By default, it is not removed.  
Instead it is added to the `content` value itself to ensure content is accessible.

Only set this to `true` if you are sure the alt text is not needed.

```js
postcssContentAltText({ stripAltText: true })
```

```pcss
.foo {
	content: url(tree.jpg) / "A beautiful tree in a dark forest";
}

/* becomes */

.foo {
	content: url(tree.jpg) ;
	content: url(tree.jpg) / "A beautiful tree in a dark forest";
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#content-alt-text
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-content-alt-text

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Content Alt Text]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-content-alt-text
[CSS Generated Content Module]: https://drafts.csswg.org/css-content/#content-property
