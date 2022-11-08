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

<envSupport>

## Formats

At this time there is no standardized format for design tokens.
Although there is an ongoing effort to create this, we feel it is still too early to adopt this.

For the moment we only support [Style Dictionary](https://amzn.github.io/style-dictionary/#/).
Use `style-dictionary3` in `@design-tokens` rules to pick this format.

## Options

### is

The `is` option determines which design tokens are used.<br>
This allows you to generate multiple themed stylesheets<br>by running PostCSS multiple times with different configurations.

By default only `@design-tokens` without any `when('foo')` conditions are used.

_This plugin itself does not produce multiple outputs, it only provides an API to change the output._

#### Example usage

**For these two token files :**

```json
<tokens-brand-1.json>
```

```json
<tokens-brand-2.json>
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

##### `is` option set to 'brand-2'.

```js
<exportName>({ is: ['brand-2'] })
```

```pcss
<example-conditional.css>

/* becomes */

<example-conditional.brand-2.expect.css>
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

### Customize function and at rule names

#### importAtRuleName

The `importAtRuleName` option allows you to set a custom alias for `@design-tokens`.

```js
<exportName>({ importAtRuleName: 'tokens' })
```

```pcss
<example-custom-import-at-rule-name.css>

/* becomes */

<example-custom-import-at-rule-name.expect.css>
```

#### valueFunctionName

The `valueFunctionName` option allows you to set a custom alias for `design-token`.

```js
<exportName>({ valueFunctionName: 'token' })
```

```pcss
<example-custom-value-function-name.css>

/* becomes */

<example-custom-value-function-name.expect.css>
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

You can also import tokens from an `npm` pacakge:

```pcss
@design-tokens url('node_modules://my-npm-package/tokens.json') format('style-dictionary3');
@design-tokens url('node_modules://my-npm-package/tokens-dark-mode.json') format('style-dictionary3') when('dark');
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

`@design-tokens` rules can be conditional through `when` conditions. Multiple values can be specified in `when`.<br>
Multiple conditions always have an `AND` relationship.

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
<unit> = [ px | rem | ... ]
```

The plugin can convert `px` to `rem` and `rem` to `px` via the [`unitsandvalues`](#unitsandvalues) plugin options.
When a design token is unit-less any `unit` can be assigned with `to`.

## Further reading

- [Why we think PostCSS Design Tokens is needed]
- [About Design Tokens (Adobe Spectrum)]

<linkList>
[Why we think PostCSS Design Tokens is needed]: https://github.com/csstools/postcss-plugins/wiki/Why-we-think-PostCSS-Design-Tokens-is-needed
[About Design Tokens (Adobe Spectrum)]: https://spectrum.adobe.com/page/design-tokens/
