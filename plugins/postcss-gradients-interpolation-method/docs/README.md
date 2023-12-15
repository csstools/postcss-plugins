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

[<humanReadableName>] lets you use different interpolation methods in CSS gradient functions following [CSS Images Module 4].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

## Shortcomings

⚠️ Color stops with only a color or only an interpolation hint are not supported.

For best results you should always provide at least the color and position for each color stop.
Double position color stops are supported.

```pcss
.foo {
	/* Only a color: can't transform */
	background-image: linear-gradient(in oklch, black 0%, green, blue 100%);

	/* Only an interpolation hint: can't transform */
	background-image: linear-gradient(in oklch, black 0%, 25%, blue 100%);
}
```

⚠️ Variable colors are also not supported.
We can not mix colors when the color is a variable.

```pcss
.foo {
	--red: red;
	/* Color stop variable : can't transform */
	background-image: linear-gradient(in oklch, black 0%, var(--red), blue 100%);
}
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

### enableProgressiveCustomProperties

The `enableProgressiveCustomProperties` option determines whether the original notation
is wrapped with `@supports` when used in Custom Properties. By default, it is enabled.

⚠️ We only recommend disabling this when you set `preserve` to `false` or if you bring your own fix for Custom Properties. See what the plugin does in its [README](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-progressive-custom-properties#readme).

```js
<exportName>({ enableProgressiveCustomProperties: false })
```

```pcss
<example.css>

/* becomes */

<example.progressive-false.expect.css>
```

_Custom properties do not fallback to the previous declaration_

<linkList>
[CSS Images Module 4]: <specUrl>
