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

[<humanReadableName>] rebases `url()` functions when transforming CSS.

When bundling CSS, the location of the final stylesheet file will be different than the individual source files.  
[<humanReadableName>] rewrites the contents of `url()` functions so that relative paths continue to work.

Instead of manually mapping where the files will be in the final output you can use this plugin  
and simply use the relative paths to each source file.

_If you need something with more knobs and dials, please checkout [`postcss-url`](https://www.npmjs.com/package/postcss-url)_

```pcss
/* when used with a bundler like `postcss-import` */

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
