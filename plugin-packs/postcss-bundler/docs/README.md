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

[<humanReadableName>] bundles your CSS.

This plugin pack contains :
- a bundler based on standard CSS `@import` statements.
- [a rebaser that rewrites URLs in your CSS.](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url)

`examples/example.css` :
```pcss
<example.css>
```

`examples/imports/basic.css`:
```pcss
<imports/basic.css>
```

when bundled :
```pcss
<example.expect.css>
```

<usage>

<envSupport>

## `postcss-import`

[`postcss-import`](https://github.com/postcss/postcss-import) is also a CSS bundler and parts of [<humanReadableName>] are based on it.  
While creating this plugin we also submitted patches to [`postcss-import`](https://github.com/postcss/postcss-import) where possible.  

[<humanReadableName>] is tuned differently and lacks configuration options that are present in [`postcss-import`](https://github.com/postcss/postcss-import).

[<humanReadableName>] is intended to just work and to be a drop-in replacement for native CSS `@import` statements.

<linkList>
