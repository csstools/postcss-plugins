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

[<humanReadableName>] lets you style by directionality using the `:dir()`
pseudo-class in CSS, following the [Selectors] specification.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

### Maintaining Specificity

Using [<humanReadableName>] will not impact selector weight, but it will
require having at least one `[dir]` attribute in your HTML. If you don’t have
_any_ `[dir]` attributes, consider using the following JavaScript:

```js
// force at least one dir attribute (this can run at any time)
document.documentElement.dir=document.documentElement.dir||'ltr';
```

If you absolutely cannot add a `[dir]` attribute in your HTML or even force one
via JavaScript, you can still work around this by presuming a direction in your
CSS using the [`dir` option](#dir), but understand that this will
sometimes increase selector weight by one element (`html`).

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

### dir

The `dir` option allows you presume a direction in your CSS. By default, this
is not specified and you are required to include a direction `[dir]` attribute
somewhere in your HTML, preferably on the `html` element.

```js
<exportName>({ dir: 'ltr' });
```

```pcss
<example.css>

/* becomes */

<example.dir-ltr.expect.css>
```

```js
<exportName>({ dir: 'rtl' });
```

```pcss
<example.css>

/* becomes */

<example.dir-rtl.expect.css>
```

### shadow

The `shadow` option determines whether the CSS is assumed to be used in Shadow DOM with Custom Elements.

```js
<exportName>({ shadow: true })
```

```pcss
<example.css>

/* becomes */

<example.shadow-true.expect.css>
```

<linkList>
[Selectors]: <specUrl>
