# PostCSS Custom Media Import/Export [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-custom-media-import-export.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Media Import/Export] lets you import or export `@custom-media`'s into or out of your CSS.

## As a drop in for old versions of `postcss-custom-media`

```js
// commonjs
const postcss = require('postcss');
const postcssCustomMediaImportExport = require('@csstools/postcss-custom-media-import-export');
const postcssCustomMedia = require('postcss-custom-media');

postcss([
	// First
	postcssCustomMediaImportExport({
		/* pluginOptions */
		importedStylesOverrideDocumentStyles: false, // mimics old `postcss-custom-media`
	}),
	// Second
	postcssCustomMedia()
]).process(YOUR_CSS /*, processOptions */);
```

## Usage

Add [PostCSS Custom Media Import/Export] to your project:

```bash
npm install postcss @csstools/postcss-custom-media-import-export --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomMediaImportExport = require('@csstools/postcss-custom-media-import-export');

postcss([
	postcssCustomMediaImportExport(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Media Import/Export] runs in all Node environments, with special
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

### importFrom

The `importFrom` option specifies sources where custom media can be imported
from, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
postcssCustomMediaImportExport({
	importFrom: 'path/to/file.css' // => @custom-selector --small-viewport (max-width: 30em);
});
```

```pcss
@media (--small-viewport) {
	/* styles for small viewport */
}

/* becomes */

@custom-selector --small-viewport (max-width: 30em);

@media (--small-viewport) {
	/* styles for small viewport */
}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace custom media using the `customMedia` or
`custom-media` key.

```js
postcssCustomMediaImportExport({
	importFrom: [
		'path/to/file.css',
		'and/then/this.js',
		'and/then/that.json',
		{
			customMedia: { '--small-viewport': '(max-width: 30em)' }
		},
		() => {
			const customMedia = { '--small-viewport': '(max-width: 30em)' };

			return { customMedia };
		}
	]
});
```

### importedStylesOverrideDocumentStyles

The `importedStylesOverrideDocumentStyles` option determines if queries added via `importFrom` override queries that exist in your CSS document.
Defaults to `false`.

```js
postcssCustomMediaImportExport({
	importedStylesOverrideDocumentStyles: true
});

### exportTo

The `exportTo` option specifies destinations where custom media can be exported
to, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
postcssCustomMediaImportExport({
	exportTo: 'path/to/file.css' // @custom-media --small-viewport (max-width: 30em);
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom media using the `customMedia` or
`custom-media` key.

```js
const cachedObject = { customMedia: {} };

postcssCustomMediaImportExport({
	exportTo: [
		'path/to/file.css',   // @custom-media --small-viewport (max-width: 30em);
		'and/then/this.js',   // module.exports = { customMedia: { '--small-viewport': '(max-width: 30em)' } }
		'and/then/this.mjs',  // export const customMedia = { '--small-viewport': '(max-width: 30em)' } }
		'and/then/that.json', // { "custom-media": { "--small-viewport": "(max-width: 30em)" } }
		cachedObject,
		customMedia => {
			customMedia    // { '--small-viewport': '(max-width: 30em)' }
		}
	]
});
```

See example exports written to [CSS](test/export-media.css),
[JS](test/export-media.js), [MJS](test/export-media.mjs), and
[JSON](test/export-media.json).

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-custom-media-import-export

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Media Import/Export]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media-import-export
