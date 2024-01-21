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

[<humanReadableName>] fallback the `initial` keyword following the [CSS Cascade 4 Specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

_See prior work by [maximkoretskiy](https://github.com/maximkoretskiy) here [postcss-initial](https://github.com/maximkoretskiy/postcss-initial)
To ensure long term maintenance and to provide the needed features this plugin was recreated based on maximkoretskiy's work._

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is preserved.

```js
<exportName>({ preserve: false })
```

```pcss
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

<linkList>
[CSS Cascade 4 Specification]: <specUrl>
