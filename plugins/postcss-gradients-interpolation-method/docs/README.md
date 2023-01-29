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

[<humanReadableName>] lets you use different interpolation methods in CSS gradient functions following [CSS Specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

## Warnings

⚠️ This plugin assumes you have a separate plugin to transform `color-mix()` to something older browsers can understand.

⚠️ Color stops with only a color and Interpolation hints are not supported.
We can not statically check if a certain value is a single color or an interpolation hint.

These are equivalent in PostCSS :

```pcss
	--red: red;
	/* Color stop variable */
	background-image: linear-gradient(90deg, black, var(--red), blue);

	--perc-10: 10%;
	/* Interpolation hint */
	background-image: linear-gradient(90deg, black, var(--perc-10), blue);
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

```pcss
<example.css>

/* becomes */

<example.preserve-true.expect.css>
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

<example.preserve-true.progressive-false.expect.css>
```

_Custom properties do not fallback to the previous declaration_

<linkList>
[CSS Specification]: <specUrl>
