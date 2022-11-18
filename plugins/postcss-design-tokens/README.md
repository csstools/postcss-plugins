# PostCSS Design Tokens [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-design-tokens.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Design Tokens] lets you use design tokens in your CSS source files.

```json
{
	"color": {
		"background": {
			"primary": { "value": "#fff" }
		}
	},
	"size": {
		"spacing": {
			"small": { "value": "16px" }
		}
	}
}
```

```pcss
@design-tokens url('./tokens.json') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
	padding-top: design-token('size.spacing.small');
	padding-left: design-token('size.spacing.small' to px);
	padding-bottom: design-token('size.spacing.small' to rem);
}

/* becomes */

.foo {
	color: #fff;
	padding-top: 16px;
	padding-left: 16px;
	padding-bottom: 1rem;
}
```

## Usage

Add [PostCSS Design Tokens] to your project:

```bash
npm install postcss @csstools/postcss-design-tokens --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssDesignTokens = require('@csstools/postcss-design-tokens');

postcss([
	postcssDesignTokens(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Design Tokens] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Create React App](INSTALL.md#create-react-app)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

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
{
	"color": {
		"background": {
			"primary": { "value": "#0ff" }
		}
	}
}
```

```json
{
	"color": {
		"background": {
			"primary": { "value": "#f0f" }
		}
	}
}
```

**And this CSS :**

```pcss
@design-tokens url('./tokens-brand-1.json') format('style-dictionary3');
@design-tokens url('./tokens-brand-2.json') when('brand-2') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
}
```

**You can configure :**

##### No `is` option.

```js
postcssDesignTokens()
```

```pcss
@design-tokens url('./tokens-brand-1.json') format('style-dictionary3');
@design-tokens url('./tokens-brand-2.json') when('brand-2') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
}

/* becomes */

.foo {
	color: #0ff;
}
```

##### `is` option set to 'brand-2'.

```js
postcssDesignTokens({ is: ['brand-2'] })
```

```pcss
@design-tokens url('./tokens-brand-1.json') format('style-dictionary3');
@design-tokens url('./tokens-brand-2.json') when('brand-2') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
}

/* becomes */

.foo {
	color: #f0f;
}
```

### unitsAndValues

The `unitsAndValues` option allows you to control some aspects of how design values are converted to CSS.
`rem` <-> `px` for example can only be calculated when we know the root font size.

#### rootFontSize

defaults to `16`

```js
postcssDesignTokens({
	unitsAndValues: {
		rootFontSize: 20,
	},
})
```

```pcss
@design-tokens url('./tokens.json') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
	padding-top: design-token('size.spacing.small');
	padding-left: design-token('size.spacing.small' to px);
	padding-bottom: design-token('size.spacing.small' to rem);
}

/* becomes */

.foo {
	color: #fff;
	padding-top: 16px;
	padding-left: 16px;
	padding-bottom: 0.8rem;
}
```

### Customize function and at rule names

#### importAtRuleName

The `importAtRuleName` option allows you to set a custom alias for `@design-tokens`.

```js
postcssDesignTokens({ importAtRuleName: 'tokens' })
```

```pcss
@tokens url('./tokens.json') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
	padding-top: design-token('size.spacing.small');
	padding-left: design-token('size.spacing.small' to px);
	padding-bottom: design-token('size.spacing.small' to rem);
}

/* becomes */

.foo {
	color: #fff;
	padding-top: 16px;
	padding-left: 16px;
	padding-bottom: 1rem;
}
```

#### valueFunctionName

The `valueFunctionName` option allows you to set a custom alias for `design-token`.

```js
postcssDesignTokens({ valueFunctionName: 'token' })
```

```pcss
@design-tokens url('./tokens.json') format('style-dictionary3');

.foo {
	color: token('color.background.primary');
	padding-top: token('size.spacing.small');
	padding-left: token('size.spacing.small' to px);
	padding-bottom: token('size.spacing.small' to rem);
}

/* becomes */

.foo {
	color: #fff;
	padding-top: 16px;
	padding-left: 16px;
	padding-bottom: 1rem;
}
```

## Syntax

[PostCSS Design Tokens] is non-standard and is not part of any official CSS Specification.

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

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-design-tokens

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Design Tokens]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-design-tokens
[Why we think PostCSS Design Tokens is needed]: https://github.com/csstools/postcss-plugins/wiki/Why-we-think-PostCSS-Design-Tokens-is-needed
[About Design Tokens (Adobe Spectrum)]: https://spectrum.adobe.com/page/design-tokens/
