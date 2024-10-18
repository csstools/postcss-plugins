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

[<humanReadableName>] lets you do this in CSS.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

Common font weights are found in the Font Weight Numeric Values section of the
[CSS Fonts Specification](https://www.w3.org/TR/css-fonts-3/#font-weight-numeric-values).

| Common Weight | Numeric Value |
| ------------- | ------------- |
| thin          | 100           |
| extralight    | 200           |
| ultralight    | 200           |
| light         | 300           |
| book          | 400           |
| normal        | 400           |
| regular       | 400           |
| roman         | 400           |
| medium        | 500           |
| semibold      | 600           |
| demibold      | 600           |
| bold          | 700           |
| extrabold     | 800           |
| ultrabold     | 800           |
| black         | 900           |
| heavy         | 900           |

These common font weights are converted to their numeric counterpart.

<usage>

<envSupport>

## Options

### prefix

The `prefix` option determines the prefix applied to properties being processed
(e.g. `x` for `-x-font-weight`). Wrapping dashes (`-`) are automatically
applied.

### weights

The `weights` option determines additional font weight keywords and numeric
pairs (e.g. `weights: { lite: 300 }` for `font-weight: lite` to become
`font-weight: 300`).

<linkList>
