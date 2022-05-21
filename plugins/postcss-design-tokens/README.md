# PostCSS Design Tokens [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

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
	padding-left: design-token('size.spacing.small' to px);
	padding-bottom: design-token('size.spacing.small' to rem);
}

/* becomes */

.foo {
	color: #fff;
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

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

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
{
	"color": {
		"background": {
			"primary": { "value": "#fff" }
		}
	}
}
```

```json
{
	"color": {
		"background": {
			"primary": { "value": "#000" }
		}
	}
}
```

**And this CSS :**

```pcss
@design-tokens url('./tokens-light.json') format('style-dictionary3');
@design-tokens url('./tokens-dark.json') when('dark') format('style-dictionary3');

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
@design-tokens url('./tokens-light.json') format('style-dictionary3');
@design-tokens url('./tokens-dark.json') when('dark') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
}

/* becomes */

.foo {
	color: #fff;
}
```

##### `is` option set to 'dark'.

```js
postcssDesignTokens({ is: ['dark'] })
```

```pcss
@design-tokens url('./tokens-light.json') format('style-dictionary3');
@design-tokens url('./tokens-dark.json') when('dark') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
}

/* becomes */

.foo {
	color: #000;
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
	padding-left: design-token('size.spacing.small' to px);
	padding-bottom: design-token('size.spacing.small' to rem);
}

/* becomes */

.foo {
	color: #fff;
	padding-left: 16px;
	padding-bottom: 0.8rem;
}
```

## Syntax

[PostCSS Design Tokens] is non-standard and is not part of any official CSS Specification.

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
               [ when(<theme-condition>) ]?
               format(<format-name>);

<theme-condition> = <string>

<format-name> = [ 'style-dictionary3' ]
```

All `@design-tokens` rules in a document are evaluated in order of appearance.
If a token with the same path and name already exists it will be overridden.

All `@design-tokens` rules are evaluated before any `design-token()` functions.

`@design-tokens` rules can never be made conditional through `@supports`, `@media` or other conditional rules.

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

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-design-tokens

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Design Tokens]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-design-tokens
