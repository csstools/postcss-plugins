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
- typed mixin arguments
- layered `@mixin` declarations
- conditional `@mixin` declarations
- mixin overrides

Run `@csstools/postcss-private-rule` after this plugin to transpile `@private` rules in style rules that do not apply a mixin.

A mixin with an unsupported definition is left unchanged: the definition and every `@apply` of that name stay as they are.
Rules that apply such a mixin are left unchanged as well, so native support keeps working for them.
The same happens when private properties in a rule can not be transpiled completely, for example when a private property registration is inside an anonymous cascade layer.

Private properties in the applying rule and in `@contents` blocks are transpiled together with the mixin.

An `@apply` with a CSS-wide keyword (`inherit`, `initial`, `unset`, `revert`, `revert-layer`) as an argument is left unchanged:
browsers substitute these keywords into the property that uses the parameter, while the specification resolves them in the argument phase.
CSS-wide keywords in parameter defaults are resolved in the argument phase.

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
