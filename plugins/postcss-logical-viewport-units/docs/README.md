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

[<humanReadableName>] lets you easily use `vb` and `vi` length units following the [CSS-Values-4 Specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### writingMode

The `writingMode` option determines whether fallback values are generated for documents with a horizontal or vertical writing mode.
By default documents have a horizontal writing mode.

```js
<exportName>({ writingMode: 'vertical' })
```

```pcss
<example.css>

/* becomes */

<example.vertical.expect.css>
```

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
[CSS-Values-4 Specification]: <specUrl>
