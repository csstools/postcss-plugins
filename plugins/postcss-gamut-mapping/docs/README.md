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

[<humanReadableName>] lets you use wide gamut colors with gamut mapping for specific displays following the [CSS Color 4 Specification].

When out of gamut colors are naively clipped the result can be radically different.  
A saturated and bright color will be much darker after clipping.

To correctly adjust colors for a narrow gamut display, the colors must be mapped.  
This is done by lowering the `chroma` in `oklch` until the color is in gamut.  

Using the `@media (color-gamut)` media feature makes it possible to only use the wide gamut colors on displays that support them.

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

<linkList>
[CSS Color 4 Specification]: <specUrl>
