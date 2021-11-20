# PostCSS Nesting [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Nesting] lets you nest style rules inside each other, following the
[CSS Nesting] specification. If you want nested rules the same way [Sass] works
you might want to use [PostCSS Nested] instead.

```pcss
a, b {
  color: red;

  & c, & d {
    color: white;
  }
}

/* becomes */

a, b {
  color: red;
}

a c, a d, b c, b d {
  color: white;
}
```

## Usage

Add [PostCSS Nesting] to your project:

```bash
npm install postcss-nesting --save-dev
```

Use [PostCSS Nesting] to process your CSS:

```js
import postcssNesting from 'postcss-nesting';

postcssNesting.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
import postcss from 'postcss';
import postcssNesting from 'postcss-nesting';

postcss([
  postcssNesting(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Nesting] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- |

### Deno

You can also use [PostCSS Nesting] on [Deno]:

```js
import postcss from "https://deno.land/x/postcss/mod.js";
import postcssNesting from "https://cdn.jsdelivr.net/npm/postcss-nesting@10/mod.js";

await postcss([postcssNesting]).process(YOUR_CSS /*, processOptions */);
```

### ⚠️ Spec disclaimer

The [CSS Nesting Module] spec states on nesting that "Declarations occuring after a nested rule are invalid and ignored.".
While we think it makes sense on browsers, enforcing this at the plugin level introduces several constrains that would
interfere with PostCSS' plugin nature such as with `@mixin`

[cli-img]: https://img.shields.io/travis/csstools/postcss-nesting.svg
[cli-url]: https://travis-ci.org/csstools/postcss-nesting
[css-img]: https://cssdb.org/badge/nesting-rules.svg
[css-url]: https://cssdb.org/#nesting-rules
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-nesting.svg
[npm-url]: https://www.npmjs.com/package/postcss-nesting

[CSS Nesting]: https://drafts.csswg.org/css-nesting-1/
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Nesting]: https://github.com/jonathantneal/postcss-nesting
[Deno]: https://deno.land/x/postcss_nesting
[PostCSS Nested]: https://github.com/postcss/postcss-nested
[Sass]: https://sass-lang.com/
[CSS Nesting Module]: https://www.w3.org/TR/css-nesting-1/
