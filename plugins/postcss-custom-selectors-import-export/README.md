# PostCSS Custom Selectors Import/Export [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-custom-selectors-import-export.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Selectors Import/Export] lets you import or export `@custom-selector`'s into or out of your CSS.

## As a drop in for old versions of `postcss-custom-selectors`

```js
// commonjs
const postcss = require('postcss');
const postcssCustomSelectorsImportExport = require('@csstools/postcss-custom-selectors-import-export');
const postcssCustomSelectors = require('postcss-custom-selectors');

postcss([
	// First
	postcssCustomSelectorsImportExport({
		/* pluginOptions */
		importedStylesOverrideDocumentStyles: false, // mimics old `postcss-custom-selectors`
	}),
	// Second
	postcssCustomSelectors()
]).process(YOUR_CSS /*, processOptions */);
```

## Usage

Add [PostCSS Custom Selectors Import/Export] to your project:

```bash
npm install postcss @csstools/postcss-custom-selectors-import-export --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomSelectorsImportExport = require('@csstools/postcss-custom-selectors-import-export');

postcss([
	postcssCustomSelectorsImportExport(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Selectors Import/Export] runs in all Node environments, with special
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

The `importFrom` option specifies sources where custom selectors can be
imported from, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
postcssCustomSelectorsImportExport({
	importFrom: 'path/to/file.css' // => @custom-selector :--heading h1, h2, h3;
});
```

```pcss
article :--heading + p {
	margin-top: 0;
}

/* becomes */

@custom-selector :--heading h1, h2, h3;

article :--heading+p {
	margin-top: 0;
}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace custom selectors using the `customSelectors` or
`custom-selectors` key.

```js
postcssCustomSelectorsImportExport({
	importFrom: [
		'path/to/file.css',
		'and/then/this.js',
		'and/then/that.json',
		{
			customSelectors: { ':--heading': 'h1, h2, h3' }
		},
		() => {
			const customSelectors = { ':--heading': 'h1, h2, h3' };

			return { customSelectors };
		}
	]
});
```

### importedStylesOverrideDocumentStyles

The `importedStylesOverrideDocumentStyles` option determines if selectors added via `importFrom` override selectors that exist in your CSS document.
Defaults to `false`.

```js
postcssCustomSelectorsImportExport({
	importedStylesOverrideDocumentStyles: true
});

### exportTo

The `exportTo` option specifies destinations where custom selectors can be
exported to, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
postcssCustomSelectorsImportExport({
	exportTo: 'path/to/file.css' // @custom-selector :--heading h1, h2, h3;
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom selectors using the `customSelectors` or
`custom-Selectors` key.

```js
const cachedObject = { customSelectors: {} };

postcssCustomSelectorsImportExport({
	exportTo: [
		'path/to/file.css',   // @custom-selector :--heading h1, h2, h3;
		'and/then/this.js',   // module.exports = { customSelectors: { ':--heading': 'h1, h2, h3' } }
		'and/then/this.mjs',  // export const customSelectors = { ':--heading': 'h1, h2, h3' } }
		'and/then/that.json', // { "custom-selectors": { ":--heading": "h1, h2, h3" } }
		cachedObject,
		(customSelectors) => {
			customSelectors    // { ':--heading': 'h1, h2, h3' }
		}
	]
});
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-custom-selectors-import-export

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Selectors Import/Export]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-selectors-import-export
