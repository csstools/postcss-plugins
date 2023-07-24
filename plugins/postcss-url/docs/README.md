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

[<humanReadableName>] rebases `url()` functions when transforming CSS.

This plugin is only intended to help with bundling CSS and only in a way that you author CSS as if there was no bundling or url rebasing.

If you need something with more knobs and dials, please checkout [`postcss-url`](https://www.npmjs.com/package/postcss-url)

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

<linkList>
