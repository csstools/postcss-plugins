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

[<humanReadableName>] lets you use the `color-mix()` function with any number of arguments following the [CSS Color 5 Specification].

```css
<example.css>

/* becomes */

<example.expect.css>
```

> [!NOTE]
> We can not dynamically resolve `var()` arguments in `color-mix()`, only static values will work.

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
<exportName>({ preserve: true })
```

```css
<example.css>

/* becomes */

<example.preserve-true.expect.css>
```

<linkList>
[CSS Color 5 Specification]: <specUrl>
