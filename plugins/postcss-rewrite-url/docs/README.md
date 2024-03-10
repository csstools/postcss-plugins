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

[<humanReadableName>] lets you rewrite url values found in CSS declarations.

```pcss
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
export interface ValueToRewrite {
	url: string
}

export interface RewriteContext {
	from: string | undefined;
	rootFrom: string | undefined;
}

export type Rewriter = (value: ValueToRewrite, context: RewriteContext) => ValueToRewrite;

/** postcss-rewrite-url plugin options */
export type pluginOptions = {
	rewriter: Rewriter;
};
```

```js
<exportName>({
	rewriter: (value, context) => {
		console.log(context); // for extra conditional logic
		return {
			url: value.url + '#modified',
		};
	},
})
```

<linkList>
