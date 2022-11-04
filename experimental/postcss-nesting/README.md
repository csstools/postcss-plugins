# PostCSS Nesting Experimental [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Nesting Experimental] lets you nest style rules inside each other, following the
[CSS Nesting] specification. If you want nested rules the same way [Sass] works
you might want to use [PostCSS Nested] instead.

⚠️ Experimental version of [PostCSS Nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)

```pcss
a, b {
	color: red;

	& c, & d {
		color: white;
	}

	:is(e) & {
		color: yellow;
	}
}

& {
	color: pink;
}


/* becomes */

a, b {
	color: red;
}

:is(a,b) c, :is(a,b) d {
		color: white;
	}

:is(e) :is(a,b) {
		color: yellow;
	}

:scope {
	color: pink;
}
```

Relative selectors :

```pcss
.parent {
	color: red;

	.child {
		color: white;
	}

	> .other-child {
		color: yellow;
	}
}

/* becomes */

.parent {
	color: red;
}

:is(.parent) .child {
	color: white;
}

:is(.parent)> .other-child {
	color: yellow;
}
```

## Usage

Add [PostCSS Nesting Experimental] to your project:

```bash
npm install @csstools/postcss-nesting-experimental --save-dev
```

Use [PostCSS Nesting Experimental] as a [PostCSS] plugin:

```js
import postcss from 'postcss';
import postcssNestingExperimental from '@csstools/postcss-nesting-experimental';

postcss([
  postcssNestingExperimental(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Nesting Experimental] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- |

## ⚠️ Spec disclaimer

The [CSS Nesting] specification states on nesting that "Declarations occurring after a nested rule are invalid and ignored.".
While we think it makes sense on browsers, enforcing this at the plugin level introduces several constraints that would
interfere with PostCSS' plugin nature such as with `@mixin`

[css-img]: https://cssdb.org/images/badges/nesting-rules.svg
[css-url]: https://cssdb.org/#nesting-rules
[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/@csstools/postcss-nesting-experimental.svg
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-nesting-experimental

[CSS Nesting]: https://drafts.csswg.org/css-nesting/
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Nesting Experimental]: https://github.com/csstools/postcss-plugins/tree/main/experimental/postcss-nesting
[PostCSS Nested]: https://github.com/postcss/postcss-nested
[Sass]: https://sass-lang.com/
