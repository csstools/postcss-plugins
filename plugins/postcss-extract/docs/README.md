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

[<humanReadableName>] lets you easily export parts of your CSS source files to JavaScript objects.

your query :

```css
rule[selector*=":root" i] > decl[variable]
```

your config :

```js
<exportName>({
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

<usage>

<envSupport>

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
<exportName>({
	queries: {
		'your-export': 'rule[selector*=":root" i] > decl[variable]'
	},
})
```

### results

The `results` option let's you define a callback to receive results.
You can then apply further transforms on the data so that it fits your use case.

```js
<exportName>({
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

<linkList>
