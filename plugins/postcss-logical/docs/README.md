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

[<humanReadableName>]  lets you use logical, rather than physical, direction and dimension mappings in CSS, following the [CSS Logical Properties and Values] specification.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### blockDirection & inlineDirection

The `blockDirection` and `inlineDirection` options allow you to specify the direction of the block and inline axes. The default values are `top-to-bottom` and `left-to-right` respectively which would match any latin language.

You might want to tweak these values if you are using a different writing system, such as Arabic, Hebrew or Chinese for example.

```js
<exportName>({
	blockDirection: 'right-to-left',
	inlineDirection: 'top-to-bottom'
})
```

```pcss
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

Please do not that some properties won't be transformed if `inlineDirection` becomes vertical.

These are:

* `float`
* `clear`
* `text-align`

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

<linkList>
[CSS Logical Properties and Values]: <specUrl>
