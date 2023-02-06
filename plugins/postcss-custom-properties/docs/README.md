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

[<humanReadableName>] lets you use Custom Properties in CSS, following
the [CSS Custom Properties] specification.

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-variables.png)](https://caniuse.com/#feat=css-variables)

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

**Note:** 
- Only processes variables that were defined in the `:root` or `html` selector.
- Locally defined variables will be used as fallbacks only within the same rule, but not elsewhere.
- Fallback values in `var()` will be used if the variable was not defined in the `:root` or `html` selector.

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether properties using
custom properties should be preserved in their original form. By default these are preserved.

Custom property declarations are always preserved only `var()` functions can be omitted.

```js
<exportName>({ preserve: false })
```

```pcss
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

<linkList>
[CSS Custom Properties]: <specUrl>
