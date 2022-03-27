<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <env-support> -->
<!-- <link-list> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets easily create new plugins following some [CSS Specification].

```json
<tokens-light.json>
```

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<env-support>

## Options

### is

The `is` option determines which design tokens are used.
This allows you to generate multiple themed stylesheets.

By default only `@design-tokens` without any `when('foo')` conditions are used.

```js
<exportName>({ is: ['dark'] })
```

```json
<tokens-dark.json>
```

```pcss
<example.css>

/* becomes */

<example.dark.expect.css>
```

<link-list>
[CSS Specification]: <specUrl>
