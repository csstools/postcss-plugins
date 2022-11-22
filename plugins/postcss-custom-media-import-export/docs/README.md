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

[<humanReadableName>] lets you define `@custom-media` in CSS following the [Custom Media Specification].

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

The `importFrom` option specifies sources where custom media can be imported
from, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
<exportName>({
	importFrom: 'path/to/file.css' // => @custom-selector --small-viewport (max-width: 30em);
});
```

```pcss
@media (max-width: 30em) {
	/* styles for small viewport */
}

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
[Custom Media Specification]: <specUrl>
