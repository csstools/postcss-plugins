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

[<humanReadableName>] lets you declare private custom properties following the [CSS Mixins Specification].

`@private` rules that contain `@property` rules inside `@container` or `@starting-style` are left as-is because those registrations can not be hoisted to the root. Because private property names are scoped to a style rule, the whole style rule is left unchanged when any of its `@private` rules can not be transpiled.

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

<linkList>
[CSS Mixins Specification]: <specUrl>
