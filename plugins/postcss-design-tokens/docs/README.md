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
<tokens.json>
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

#### Example usage

**For these two token files :**

```json
<tokens-light.json>
```

```json
<tokens-dark.json>
```

**And this CSS :**

```pcss
<example-conditional.css>
```

**You can configure :**

##### No `is` option.

```js
<exportName>()
```

```pcss
<example-conditional.css>

/* becomes */

<example-conditional.expect.css>
```

##### `is` option set to 'dark'.

```js
<exportName>({ is: ['dark'] })
```

```pcss
<example-conditional.css>

/* becomes */

<example-conditional.dark.expect.css>
```

<link-list>
[CSS Specification]: <specUrl>
