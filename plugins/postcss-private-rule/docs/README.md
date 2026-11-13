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

`@private` rules that contain `@property` rules inside `@container` or `@starting-style` are left as-is because those registrations can not be hoisted to the root. Because private property names are scoped to a style rule and are visible in nested rules, the whole style rule and its nested style rules are left unchanged when any `@private` rule in that subtree can not be transpiled.

Run this plugin after `@csstools/postcss-mixins` and before `@csstools/postcss-custom-functions` so that mixin bodies can use private properties and function bodies do not capture them.

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

<linkList>
[CSS Mixins Specification]: <specUrl>
