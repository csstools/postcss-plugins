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

[<humanReadableName>] lets you define `@custom-selector` in CSS following the [Custom Selectors Specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
<exportName>({ preserve: true })
```

```pcss
<example.css>

/* becomes */

<example.preserve.expect.css>
```

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

article h1 + p, article h2 + p, article h3 + p {}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace custom selectors using the `customProperties` or
`custom-properties` key.

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
			const customProperties = { ':--heading': 'h1, h2, h3' };

			return { customProperties };
		}
	]
});
```

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
need to namespace custom selectors using the `customProperties` or
`custom-properties` key.

```js
const cachedObject = { customSelectors: {} };

<exportName>({
	exportTo: [
		'path/to/file.css',   // @custom-selector :--heading h1, h2, h3;
		'and/then/this.js',   // module.exports = { customSelectors: { ':--heading': 'h1, h2, h3' } }
		'and/then/this.mjs',  // export const customSelectors = { ':--heading': 'h1, h2, h3' } }
		'and/then/that.json', // { "custom-selectors": { ":--heading": "h1, h2, h3" } }
		cachedObject,
		customProperties => {
			customProperties    // { ':--heading': 'h1, h2, h3' }
		}
	]
});
```

<linkList>
[Custom Selectors Specification]: <specUrl>
