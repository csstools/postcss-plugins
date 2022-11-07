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

[<humanReadableName>] lets you define `@custom-media` in CSS following the [Custom Media Specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

## `true` and `false`

With `@custom-media` you can use the constants `true` and `false`.
These are especially handy when debugging.

You are unsure how your page is affected when a certain media query matches or not you can use these to quickly toggle the results.
This plugin downgrades these queries to something that works in all browsers.

Quickly check the result as if the query matches:

```pcss
<true.css>

/* becomes */

<true.expect.css>
```

Quickly check the result as if the query does not match:

```pcss
<false.css>

/* becomes */

<false.expect.css>
```

## logical evaluation of complex media queries

It is impossible to accurately and correctly resolve complex `@custom-media` queries
as these depend on the browser the queries will eventually run in.

_Some of these queries will have only one possible outcome but we have to account for all possible queries in this plugin._

⚠️ When handling complex media queries you will see that your CSS is doubled for each level of complexity.
GZIP works great to de-dupe this but a lot of complex media queries will have a performance impact.

An example of a very complex (and artificial) use-case :

```pcss
<complex.css>

/* becomes */

<complex.expect.css>
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

<example.preserve.expect.css>
```

<linkList>
[Custom Media Specification]: <specUrl>
