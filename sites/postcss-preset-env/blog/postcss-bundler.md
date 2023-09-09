---
title: PostCSS Bundler
description: A better bundler for CSS
date: 2023-09-10
---

[PostCSS Bundler] is a standards compliant CSS bundler.

It is built around `@import` statements, similarly to [esbuild](https://esbuild.github.io), [postcss-import](https://www.npmjs.com/package/postcss-import) or [lightningcss](https://lightningcss.dev).

```css
@import url('variables.css');
@import url('typography.css');
@import url('components/not-a-card.css');
```

It however is much stricter and complete in it's implementation.  
Allowing you to do more with it.


## Why this is matters now

Previously CSS `@import` was relatively simple.

There were always a few features (`@namespace`, `@charset`, ...) that weren't or couldn't be implemented correctly in bundlers but these also happened to be obscure and rarely used features.

CSS Bundlers had the luxury of getting by with naive implementations.  
Even with duplicate and cyclical imports it was largely invisible if a bundler incorrectly only included the first or the last import.

Today however this is no longer true.

We now have cascade layers, support conditions and soon even scoping in `@import` statements.  
With the addition of these features the source order is more important than ever and bundlers need to be updated so that you can use all of CSS.

```css
@import url('all-the-styles.css')
	layer(base)
	supports(selector(&))
	(prefers-color-scheme: dark);
```


## `css-import-tests`

We created an [extensive test suite](https://github.com/romainmenke/css-import-tests) for the behavior of `@import` in browsers and how these can be mimicked by bundlers. It is not limited to testing what bundlers can do, it also tests what can not be implemented.

The goal of this test suite is not to score different bundlers against each other, but to **promote interop.**  
We reached out to the maintainers of [esbuild](https://esbuild.github.io) and [lightningcss](https://lightningcss.dev) so that they are aware of this effort and so that we can coordinate our efforts.

_If there are other CSS bundlers that we haven't thought of, please let us know in a [GitHub issue](https://github.com/csstools/postcss-plugins/issues)_

In particular we want to thank Evan from [esbuild](https://esbuild.github.io) as they immediately jumped on this and also contributed back to the test suite. In a very short time they fixed a large number of small discrepancies in [esbuild](https://esbuild.github.io). They also provided insights and very neat tricks that made sub-features possible that we had already given up on.

By sharing [`css-import-tests`](https://github.com/romainmenke/css-import-tests) and working together with other tool creators we take away part of the workload of each individual maintainer.


## `@csstools/postcss-bundler`

a.k.a [PostCSS Bundler]

This is our implementation of a bundler that passes as many tests from [`css-import-tests`](https://github.com/romainmenke/css-import-tests) as possible.

Our vision and goal for this package is that you should be able to turn it on or off and that your CSS should just work either way.

To see more examples you can visit the [general docs](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler#readme) or you can experiment with the [minimal PostCSS setup recipe](https://github.com/csstools/postcss-plugins/tree/main/postcss-recipes/minimal-setup).


### Url rewriting/rebasing

A feature currently unique to [PostCSS Bundler] is that it also rebases url values.
You just write correct file paths in `url()` functions and [PostCSS Bundler] will update relative paths so that they still work from the bundled file.  
This gives a better dev experience because your file links will actually work in your code editor.


### imports of node modules

Importing npm packages is not a standard feature and we decided not to add magic for it.  
Instead we added an explicit and expressive API to reference packages found in `node_modules` directories.

```css
@import url("node_modules:open-props/red");
```

By adding the `node_modules:` url scheme you make it clear to [PostCSS Bundler] that it should use the module resolution algorithms to find your CSS. This also supports conditional exports.

We decided against the `npm:` url scheme because this is already used in Deno.  
In Deno it also implies an automatic download which is not something we can or want to implement.  
You still need to use your regular JavaScript tooling to download and manage npm packages even when they contain CSS files.

`node_modules:` is a bit longer but it is absolutely clear in its meaning and purpose.


### Going toolless

Ultimately we hope that [PostCSS Bundler] is frictionless and that it gives you the option to go toolless.  
You might still want to bundle for production to prevent a waterfall during load, but a bundler shouldn't be required during development.


## Stylelint plugin

Not every valid `@import` statement can be correctly processed by CSS bundlers.  
Some aspects only make sense when interpreted by a real browser, not a build tool.

To warn you about these cases we created a [Stylelint](https://stylelint.io) plugin, [`@csstools/stylelint-no-invalid-at-import-rules-when-bundling`](https://github.com/csstools/postcss-plugins/blob/main/plugins-stylelint/no-invalid-at-import-rules-when-bundling#readme).

This [Stylelint](https://stylelint.io) plugin can be used with any standards compliant CSS bundler as they will all have the same edge cases.


## `postcss-import`

[PostCSS Bundler] is partly based on [postcss-import](https://www.npmjs.com/package/postcss-import) and we have contributed many fixes to it during this process. We will continue to improve this plugin as it is a widely used bundler for PostCSS.

There were however a few breaking changes we wanted to make and a new plugin makes this simpler and easier.

The largest difference is that we want the default config to be standards compliant so that your config is simpler and smaller.

```js
const postcss = require('postcss');
const postcssBundler = require('@csstools/postcss-bundler');

postcss([
	/* this just works, no other config is needed */
	postcssBundler()
]).process(YOUR_CSS /*, processOptions */);
```


[PostCSS Bundler]: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler
