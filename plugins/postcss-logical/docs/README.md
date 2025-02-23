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

[<humanReadableName>]  lets you use logical, rather than physical, direction and dimension mappings in CSS, following the [CSS Logical Properties and Values] specification.

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### `blockDirection` and `inlineDirection`

The `blockDirection` and `inlineDirection` options allow you to specify the direction of the block and inline axes. The default values are `top-to-bottom` and `left-to-right` respectively, which would match any latin language.

**You should tweak these values so that they are specific to your language and writing mode.**

```js
<exportName>({
	blockDirection: 'right-to-left',
	inlineDirection: 'top-to-bottom'
})
```

```css
<example.css>

/* becomes */

<example.chinese.expect.css>
```

Each direction must be one of the following:

- `top-to-bottom`
- `bottom-to-top`
- `left-to-right`
- `right-to-left`

You can't mix two vertical directions or two horizontal directions so for example `top-to-bottom` and `right-to-left` are valid, but `top-to-bottom` and `bottom-to-top` are not.

Please do note that `text-align` won't be transformed if `inlineDirection` becomes vertical.

### `ignoreCustomProperties`

The `ignoreCustomProperties` option allows you to ignore any properties containing `var()`.  
`postcss-logical` assumes that all custom properties are single value (e.g. `--foo: 10px;`) and will assign these to physical properties as fallbacks for logical properties.  

This will produce broken declarations when your custom properties contain multiple values instead (e.g. `--foo: 1px 2px;`).

```css
<inset.css>

/* becomes */

<inset.expect.css>
```

With `ignoreCustomProperties` set to `true`:

```css
<inset.css>

/* becomes */

<inset.ignore-custom-properties.expect.css>
```

<linkList>
[CSS Logical Properties and Values]: <specUrl>
