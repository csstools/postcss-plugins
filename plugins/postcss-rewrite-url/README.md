# PostCSS Rewrite URL [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

`npm install @csstools/postcss-rewrite-url --save-dev`

[PostCSS Rewrite URL] lets you rewrite url values in CSS.

```pcss
.foo {
	background: rewrite-url('foo.png');
}

@font-face {
	font-family: "Trickster";
	src:
		local("Trickster"),
		rewrite-url("trickster-COLRv1.otf") format("opentype");
}

/* becomes */

.foo {
	background: url("foo.png#modified");
}

@font-face {
	font-family: "Trickster";
	src:
		local("Trickster"),
		url("trickster-COLRv1.otf#modified") format("opentype");
}
```

## Usage

Add [PostCSS Rewrite URL] to your project:

```bash
npm install postcss @csstools/postcss-rewrite-url --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssRewriteURL = require('@csstools/postcss-rewrite-url');

postcss([
	postcssRewriteURL(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```



## Options

### rewriter

Determine how urls are rewritten with the `rewriter` callback.

```ts
export interface ValueToRewrite {
	url: string
}

export interface RewriteContext {
	type: 'declaration-value' | 'at-rule-prelude';
	from: string | undefined;
	rootFrom: string | undefined;
	property?: string;
	atRuleName?: string;
}

export type Rewriter = (value: ValueToRewrite, context: RewriteContext) => ValueToRewrite | false;

/** postcss-rewrite-url plugin options */
export type pluginOptions = {
	rewriter: Rewriter;
};
```

```js
postcssRewriteURL({
	rewriter: (value, context) => {
		if (value.url === 'ignore-me') {
			// return `false` to ignore this url and preserve `rewrite-url()` in the output
			return false;
		}

		console.log(context); // for extra conditional logic
		return {
			url: value.url + '#modified',
		};
	},
})
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-rewrite-url

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Rewrite URL]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rewrite-url
