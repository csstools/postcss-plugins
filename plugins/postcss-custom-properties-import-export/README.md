# PostCSS Custom Properties Import/Export [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-custom-properties-import-export.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Properties Import/Export] lets you import or export CSS custom properties (`--foo: pink;`) into or out of your CSS.

## As a drop in for old versions of `postcss-custom-properties`

⚠️ `postcss-custom-properties` no longer removes any custom properties.
If you inject a lot of properties they will all be added to your final CSS.
Use a separate CSS minifier/optimizer to remove unused custom properties.

```js
// commonjs
const postcss = require('postcss');
const postcssCustomPropertiesImportExport = require('@csstools/postcss-custom-properties-import-export');
const postcssCustomProperties = require('postcss-custom-properties');

postcss([
	// First
	postcssCustomPropertiesImportExport({
		/* pluginOptions */
		importedStylesOverrideDocumentStyles: true, // mimics old `postcss-custom-properties`
	}),
	// Second
	postcssCustomProperties()
]).process(YOUR_CSS /*, processOptions */);
```

## Usage

Add [PostCSS Custom Properties Import/Export] to your project:

```bash
npm install postcss @csstools/postcss-custom-properties-import-export --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomPropertiesImportExport = require('@csstools/postcss-custom-properties-import-export');

postcss([
	postcssCustomPropertiesImportExport(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Properties Import/Export] runs in all Node environments, with special
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

The `importFrom` option specifies sources where custom properties can be
imported from, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
postcssCustomPropertiesImportExport({
	importFrom: 'path/to/file.css' // => :root { --color: var(rgb(245 20 255)); }
});
```

```pcss
article {
	color: var(--color);
}

/* becomes */

:root {
	--color: var(rgb(245 20 255));
}

article {
	color: var(--color);
}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace custom properties using the `customProperties` or
`custom-properties` key.

```js
postcssCustomPropertiesImportExport({
	importFrom: [
		'path/to/file.css',
		'and/then/this.js',
		'and/then/that.json',
		{
			customProperties: { '--color': 'var(rgb(245 20 255))' }
		},
		() => {
			const customProperties = { '--color': 'var(rgb(245 20 255))' };

			return { customProperties };
		}
	]
});
```

### importedStylesOverrideDocumentStyles

The `importedStylesOverrideDocumentStyles` option determines if properties added via `importFrom` override properties that exist in your CSS document.
Defaults to `false`.

```js
postcssCustomPropertiesImportExport({
	importedStylesOverrideDocumentStyles: true
});

### exportTo

The `exportTo` option specifies destinations where custom properties can be
exported to, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
postcssCustomPropertiesImportExport({
	exportTo: 'path/to/file.css' // :root { --color: var(rgb(245 20 255)); }
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom properties using the `customProperties` or
`custom-properties` key.

```js
const cachedObject = { customProperties: {} };

postcssCustomPropertiesImportExport({
	exportTo: [
		'path/to/file.css',   // :root { --color: var(rgb(245 20 255)); }
		'and/then/this.js',   // module.exports = { customProperties: { '--color': 'var(rgb(245 20 255))' } }
		'and/then/this.mjs',  // export const customProperties = { '--color': 'var(rgb(245 20 255))' } }
		'and/then/that.json', // { "custom-properties": { "--color": "var(rgb(245 20 255))" } }
		cachedObject,
		(customProperties) => {
			customProperties    // { '--color': 'var(rgb(245 20 255))' }
		}
	]
});
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-custom-properties-import-export

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Properties Import/Export]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-properties-import-export
