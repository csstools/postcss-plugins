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

[<humanReadableName>] lets you `:any-link` pseudo-class in CSS,
following the [Selectors] specification.

```pcss
<example.css>

/* becomes */

<example.expect.css>
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

### subFeatures

#### areaHrefNeedsFixing

The `subFeatures.areaHrefNeedsFixing` option determines if `<area href>` elements should match `:any-link` pseudo-class.<br>
In IE and Edge these do not match `:link` or `:visited`.

_This increased CSS bundle size and is disabled by default._

```js
<exportName>({
	subFeatures: {
		areaHrefNeedsFixing: true
	}
})
```

```pcss
<example.css>

/* becomes */

<example.area-false.expect.css>
```

<linkList>
[Selectors]: <specUrl>
