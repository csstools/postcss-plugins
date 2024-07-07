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

[<humanReadableName>] generates fallback values for `content` with alt text following the [CSS Generated Content Module].

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
is preserved. By default, it is preserved.

```js
<exportName>({ preserve: false })
```

```pcss
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

### stripAltText

The `stripAltText` option determines whether the alt text is removed from the value.  
By default, it is not removed.  
Instead it is added to the `content` value itself to ensure content is accessible.

Only set this to `true` if you are sure the alt text is not needed.

```js
<exportName>({ stripAltText: true })
```

```pcss
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

<linkList>
[CSS Generated Content Module]: <specUrl>
