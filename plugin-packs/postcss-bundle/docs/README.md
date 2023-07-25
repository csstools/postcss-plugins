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

[<humanReadableName>] bundles your CSS without changing the way you write CSS.

This plugin pack contains : 
- [`postcss-import`](https://github.com/postcss/postcss-import)
- [`@csstools/postcss-rebase-url`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url)

It configures these plugins so that the default behavior is very similar to native CSS.

```pcss
/* test/examples/example.css */
<example.css>

/* test/examples/imports/basic.css */
<imports/basic.css>

/* becomes */

/* test/examples/example.expect.css */
<example.expect.css>
```

<usage>

<envSupport>

## Options

### preserve

The `import` option is passed to `postcss-import`

```js
<exportName>({ 
	import: {
		// any postcss-import options:
		// https://github.com/postcss/postcss-import
	}
})
```

<linkList>
