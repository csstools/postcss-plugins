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

[<humanReadableName>] lets you use `overscroll-behavior-inline` and `overscroll-behavior-block` properties following the [CSS Overscroll Specification].

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### inlineDirection

The `inlineDirection` option allows you to specify the direction of the inline axe. The default value is `left-to-right`, which would match any latin language.

**You should tweak this value so that it is specific to your language and writing mode.**

```js
<exportName>({
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

<linkList>
[CSS Overscroll Specification]: <specUrl>
