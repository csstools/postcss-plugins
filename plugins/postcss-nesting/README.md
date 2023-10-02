# PostCSS Nesting [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-nesting.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/nesting-rules.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install postcss-nesting --save-dev
```

[PostCSS Nesting] lets you nest style rules inside each other, following the [CSS Nesting specification].

If you want nested rules the same way [Sass] works
you might want to use [PostCSS Nested] instead.

```pcss
.foo {
	color: red;

	&:hover {
		color: green;
	}

	> .bar {
		color: blue;
	}

	@media (prefers-color-scheme: dark) {
		color: cyan;
	}
}

/* becomes */

.foo {
	color: red;
}
.foo:hover {
		color: green;
	}
.foo  > .bar {
		color: blue;
	}
@media (prefers-color-scheme: dark) {
	.foo {
		color: cyan;
}
	}
```

## Usage

Add [PostCSS Nesting] to your project:

```bash
npm install postcss postcss-nesting --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssNesting = require('postcss-nesting');

postcss([
	postcssNesting(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Nesting] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## ⚠️ `@nest` has been removed from the specification.

Previous iterations of the [CSS Nesting specification] required using `@nest` for certain selectors.

`@nest` was removed from the specification completely.

We advice everyone to migrate their codebase **now** to nested CSS without `@nest`.  
We published a [Stylelint Plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins-stylelint/no-at-nest-rule#csstoolsstylelint-no-at-nest-rule) to help you migrate.


[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#nesting-rules
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-nesting

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Nesting]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting
[PostCSS Nested]: https://github.com/postcss/postcss-nested
[Sass]: https://sass-lang.com/
[CSS Nesting specification]: https://www.w3.org/TR/css-nesting-1/
