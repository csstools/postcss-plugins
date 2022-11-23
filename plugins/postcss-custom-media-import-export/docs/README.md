<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packageVersion> 1.0.0 -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <envSupport> -->
<!-- <corsWarning> -->
<!-- <linkList> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you import or export `@custom-media`'s into or out of your CSS.

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

<usage>

<envSupport>

## Options

### importFrom

The `importFrom` option specifies sources where custom media can be imported
from, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
<exportName>({
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
<exportName>({
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
<exportName>({
	importedStylesOverrideDocumentStyles: true
});

### exportTo

The `exportTo` option specifies destinations where custom media can be exported
to, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
<exportName>({
	exportTo: 'path/to/file.css' // @custom-media --small-viewport (max-width: 30em);
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom media using the `customMedia` or
`custom-media` key.

```js
const cachedObject = { customMedia: {} };

<exportName>({
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

<linkList>
