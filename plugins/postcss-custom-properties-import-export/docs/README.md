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

[<humanReadableName>] lets you import or export CSS custom properties (`--foo: pink;`) into or out of your CSS.

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

<usage>

<envSupport>

## Options

### importFrom

The `importFrom` option specifies sources where custom properties can be
imported from, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
<exportName>({
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
<exportName>({
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
<exportName>({
	importedStylesOverrideDocumentStyles: true
});

### exportTo

The `exportTo` option specifies destinations where custom properties can be
exported to, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
<exportName>({
	exportTo: 'path/to/file.css' // :root { --color: var(rgb(245 20 255)); }
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom properties using the `customProperties` or
`custom-properties` key.

```js
const cachedObject = { customProperties: {} };

<exportName>({
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

<linkList>
