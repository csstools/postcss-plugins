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
<!-- <parallelBuildsNotice> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you inject CSS that is removed again before the final output. This is useful for  plugins that use global CSS as data.

For example, in the case of CSS Modules with [PostCSS Custom Media](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media), rules are usually not imported by every single file, so PostCSS Custom Media cannot generate fallbacks.
By providing a list of files, this plugin will inject the global CSS as data so that PostCSS Custom Media can generate fallbacks.

It is important that [<humanReadableName>] is used before the plugin that actually needs the data.

Please note that [<humanReadableName>] does not add anything to the output of your CSS. It only injects data into PostCSS so that other plugins
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
