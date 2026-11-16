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

`@property` rules inside `@private` rules are hoisted to the root. Registrations inside `@container`, `@scope` and `@starting-style` are hoisted as if they were defined outside of those rules, matching their specifications. Registrations inside `@layer` and inside `@media` or `@supports` keep their enclosing rules.

Style rules are left unchanged when the private properties can not be transpiled faithfully: when a registration is inside an anonymous layer, or when `@apply` or `@contents` is still present.

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
