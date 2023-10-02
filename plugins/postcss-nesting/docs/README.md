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

[<humanReadableName>] lets you nest style rules inside each other, following the [CSS Nesting specification].

If you want nested rules the same way [Sass] works
you might want to use [PostCSS Nested] instead.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## ⚠️ `@nest` has been removed from the specification.

Previous iterations of the [CSS Nesting specification] required using `@nest` for certain selectors.

`@nest` was removed from the specification completely.

We advice everyone to migrate their codebase **now** to nested CSS without `@nest`.  
We published a [Stylelint Plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins-stylelint/no-at-nest-rule#csstoolsstylelint-no-at-nest-rule) to help you migrate.


<linkList>
[PostCSS Nested]: https://github.com/postcss/postcss-nested
[Sass]: https://sass-lang.com/
[CSS Nesting specification]: <specUrl>
