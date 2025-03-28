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
<!-- <parallelBuildsNotice> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you rewrite url values in CSS.

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### rewriter

Determine how urls are rewritten with the `rewriter` callback.

```ts
interface ValueToRewrite {
	url: string;
	urlModifiers: Array<string>;
}

interface RewriteContext {
	type: 'declaration-value' | 'at-rule-prelude';
	from: string | undefined;
	rootFrom: string | undefined;
	property?: string;
	atRuleName?: string;
}

type Rewriter = (value: ValueToRewrite, context: RewriteContext) => ValueToRewrite | false;

/** postcss-rewrite-url plugin options */
type pluginOptions = {
	rewriter: Rewriter;
};
```

```js
<exportName>({
	rewriter: (value, context) => {
		console.log(value); // info about the `rewrite-url()` function itself (e.g. the url and url modifiers)
		console.log(context); // context surrounding the `rewrite-url()` function (i.e. where was it found?)

		if (value.url === 'ignore-me') {
			// return `false` to ignore this url and preserve `rewrite-url()` in the output
			return false;
		}

		// use url modifiers to trigger specific behavior
		if (value.urlModifiers.includes('--a-custom-modifier')) {
			return {
				url: value.url + '#other-modification',
				urlModifiers: [], // pass new or existing url modifiers to emit these in the final result
			};
		}

		return {
			url: value.url + '#modified',
		};
	},
})
```

## Syntax

[<humanReadableName>] is non-standard and is not part of any official CSS Specification.

### `rewrite-url()` function

The `rewrite-url()` function takes a url string and optional url modifiers and will be transformed to a standard `url()` function by a dev tool.

```css
.foo {
	background: rewrite-url('foo.png');
}
```

```
rewrite-url() = rewrite-url( <string> <url-modifier>* )
```

#### [Stylelint](https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown/#propertiessyntax--property-syntax-)

Stylelint is able to check for unknown property values.
Setting the correct configuration for this rule makes it possible to check even non-standard syntax.

```js
"languageOptions": {
	"syntax": {
		"types": {
			"url": "| rewrite-url( <string> <url-modifier>* )"
		}
	}
},
"rules": {
	"function-no-unknown": [
		true,
		{
			"ignoreFunctions": ["rewrite-url"]
		}
	]
}
```

<linkList>
