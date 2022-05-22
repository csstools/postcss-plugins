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

[<humanReadableName>] lets you use design tokens in your CSS source files.

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

## Formats

At this time there is no standardized format for design tokens.
Although there is an ongoing effort to create this, we feel it is still too early to adopt this.

For the moment we only support [Style Dictionary](https://amzn.github.io/style-dictionary/#/).
Use `style-dictionary3` in `@design-tokens` rules to pick this format.

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

### unitsAndValues

The `unitsAndValues` option allows you to control some aspects of how design values are converted to CSS.
`rem` <-> `px` for example can only be calculated when we know the root font size.

#### rootFontSize

defaults to `16`

```js
<exportName>({
	unitsAndValues: {
		rootFontSize: 20,
	},
})
```

```pcss
<example.css>

/* becomes */

<example.rootFontSize-20.expect.css>
```

## Syntax

[<humanReadableName>] is non-standard and is not part of any official CSS Specification.

### Editor support

This is all very new and we hope that one day design tokens will become first class citizens in editors and other tools.
Until then we will do our best to provide extensions.
These will have rough edges but should illustrate were we want to go.

| editor | plugin |
| --- | --- |
| VSCode | [CSSTools Design Tokens](https://marketplace.visualstudio.com/items?itemName=RomainMenke.csstools-design-tokens) |

### `@design-tokens` rule

The `@design-tokens` rule is used to import design tokens from a JSON file into your CSS.

```pcss
@design-tokens url('./tokens.json') format('style-dictionary3');
```

```pcss
@design-tokens url('./tokens.json') format('style-dictionary3');
@design-tokens url('./tokens-dark-mode.json') format('style-dictionary3') when('dark');
```

```
@design-tokens [ <url> | <string> ]
               [ when(<theme-condition>*) ]?
               format(<format-name>);

<theme-condition> = <string>

<format-name> = [ 'style-dictionary3' ]
```

All `@design-tokens` rules in a document are evaluated in order of appearance.
If a token with the same path and name already exists it will be overridden.

All `@design-tokens` rules are evaluated before any `design-token()` functions.

`@design-tokens` rules can be conditional through `when` conditions. Multiple values can be specified in `when`.

> ```css
> /* only evaluated when tooling receives 'blue' and 'muted' as arguments */
> @design-tokens url('./tokens.json') format('style-dictionary3') when('blue' 'muted');
> ```

`@design-tokens` rules can never be made conditional through `@supports`, `@media` or other conditional rules.

> ```css
> @media (min-width: 500px) {
>   @design-tokens url('./tokens.json') format('style-dictionary3'); /* always evaluated */
> }
> ```

Any form of nesting is meaningless, `@design-tokens` will always be evaluated as if they were declared at the top level.


### `design-token()` function

The `design-token()` function takes a token path and returns the token value.

```pcss
.foo {
	color: design-token('color.background.primary');
}
```

```
design-token() = design-token( <token-path> [ to <unit> ]? )

<token-path> = <string>
<unit> = [ px | rem ]
```

<link-list>
