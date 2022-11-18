# PostCSS Extract [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-extract.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Extract] lets you easily export parts of your CSS source files to JavaScript objects.

your query :

```css
rule[selector*=":root" i] > decl[variable]
```

your config :

```js
postcssExtract({
	queries: {
		'your-export': 'rule[selector*=":root" i] > decl[variable]'
	},
	results: function(results) {
		console.log(results)
	}
})
```

your css :

```css
:root {
	--your-property: cyan;
}

.other {
	--other-property: yellow;
}
```

the exported data :

```js
[
	{ type: 'decl', prop: '--your-property', value: 'cyan', variable: true },
]
```

## Usage

Add [PostCSS Extract] to your project:

```bash
npm install postcss @csstools/postcss-extract --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssExtract = require('@csstools/postcss-extract');

postcss([
	postcssExtract(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Extract] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Create React App](INSTALL.md#create-react-app)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### queries

The `queries` option let's you define which parts of your CSS are exported.
Each query is written in CSS.

Supported combinators:
- `>` direct child
- ` ` any descendant (space)
- `+` adjacent sibling
- `~` general sibling

Supported selectors:
- `*` any node
- `atrule`
- `rule`
- `decl`
- `comment`
- `[type=decl]`
- `[value=cyan]`
- `[value=cyan i]` case insensitive
- `[value^=cy]` starts with
- `[value*=ya]` contains
- `[value$=an]` ends with
- `:not(<complex selector>)`

Browse the [PostCSS API](https://postcss.org/api/) to gain more insights into the AST naming and structure.

```js
postcssExtract({
	queries: {
		'your-export': 'rule[selector*=":root" i] > decl[variable]'
	},
})
```

### results

The `results` option let's you define a callback to receive results.
You can then apply further transforms on the data so that it fits your use case.

```js
postcssExtract({
	results: (yourResults) => {
		console.log(yourResults);
	},
})
```

### extractLate

The `extractLate` option let's you define if the queries are run early or late in the PostCSS process.

`extractLate: false` uses `Once` in PostCSS.<br>
This means that it will try to run early.

`extractLate: true` uses `OnceExit` in PostCSS.<br>
This means that it will try to run late.

The order of plugins is still respected if multiple plugins use `Once`|`OnceExit`.

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-extract

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Extract]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-extract
