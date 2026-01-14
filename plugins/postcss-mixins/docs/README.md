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

[<humanReadableName>] lets you use `@mixin` and `@apply` following [CSS Mixins 1].

Several specification aspects of CSS Mixins still need to be settled.  
This plugin is only a partial implementation to avoid conflicts with the final specification.

Unsupported:
- mixin arguments
- `@contents` blocks
- `@result` blocks
- layered `@mixin` declarations
- mixin overrides

```css
<example.css>

/* becomes */

<example.expect.css>
```

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
[CSS Mixins 1]: <specUrl>
