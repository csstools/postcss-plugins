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

[<humanReadableName>] lets you import or export `@custom-selector`'s into or out of your CSS.

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

<usage>

<envSupport>

## Options

### importFrom

The `importFrom` option specifies sources where custom selectors can be
imported from, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
<exportName>({
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
<exportName>({
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
<exportName>({
	importedStylesOverrideDocumentStyles: true
});

### exportTo

The `exportTo` option specifies destinations where custom selectors can be
exported to, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
<exportName>({
	exportTo: 'path/to/file.css' // @custom-selector :--heading h1, h2, h3;
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom selectors using the `customSelectors` or
`custom-Selectors` key.

```js
const cachedObject = { customSelectors: {} };

<exportName>({
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

<linkList>
