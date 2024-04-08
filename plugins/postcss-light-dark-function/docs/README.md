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

[<humanReadableName>] lets you use the `light-dark` color function in
CSS, following the [CSS Color 5 Specification].

Read more about this feature on mdn:
- define the colors for light and dark with [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)
- define which elements support light and/or dark with [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)

With both features combined you can mix and match color schemes in a single document, while also respecting the user's preferences.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

Declare that your document supports both light and dark mode:

```pcss
<root.css>

/* becomes */

<root.expect.css>
```

Dynamically alter the supported color scheme for some elements:

```pcss
<element.css>

/* becomes */

<element.expect.css>
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

### enableProgressiveCustomProperties

The `enableProgressiveCustomProperties` option determines whether the original notation
is wrapped with `@supports` when used in Custom Properties. By default, it is enabled.

> [!NOTE]
> We only recommend disabling this when you set `preserve` to `false` or if you bring your own fix for Custom Properties.  
> See what the plugin does in its [README](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties#readme).

```js
<exportName>({ enableProgressiveCustomProperties: false })
```

<linkList>
[CSS Color 5 Specification]: <specUrl>
