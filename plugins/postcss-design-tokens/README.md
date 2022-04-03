# PostCSS Design Tokens [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-design-tokens.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/TODO.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Design Tokens] lets easily create new plugins following some [CSS Specification].

```json
{
	"color": {
		"background": {
			"primary": { "value": "#fff" }
		}
	}
}
```

```pcss
@design-tokens url('./tokens.json') format('style-dictionary3');

.foo {
	color: design-token('color.background.primary');
}

/* becomes */

.foo {
	color: #fff;
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

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#TODO
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-design-tokens

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Design Tokens]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-design-tokens
[CSS Specification]: #TODO
