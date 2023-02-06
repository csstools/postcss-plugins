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

[<humanReadableName>] lets you inject data into PostCSS that then gets removed from the final CSS. This is useful for 
plugins might use data to generate CSS. For example, in the case of CSS Modules with [PostCSS Custom Media](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media), rules
are usually not imported by every single file so Custom Media cannot generate any code based on the available data. By
providing a list of files, this plugin will inject the data into the CSS so that the plugin can generate the code.

Please note that [<humanReadableName>] does not produce any CSS. It only injects data into PostCSS so that other plugins
can actually use it.

<usage>

<envSupport>

## Options

### files

The `files` option determines which files to inject into PostCSS.

```js
<exportName>({ 
	files: [
		'./src/css/variables.css',
		'./src/css/media-queries.css',
	],
});
```

<linkList>
