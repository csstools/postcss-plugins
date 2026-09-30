# PostCSS Custom Functions [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-custom-functions.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]<br><br>[<img alt="Baseline Status" src="https://cssdb.org/images/badges-baseline/custom-functions.svg" height="20">][css-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/custom-functions.svg" height="20">][css-url] 

```bash
npm install @csstools/postcss-custom-functions --save-dev
```

[PostCSS Custom Functions] lets you use `@function` custom functions following [CSS Custom Functions and Mixins 1].

Custom functions are still an early draft.  
This plugin is only a partial implementation to avoid conflicts with the final specification.

Unsupported:
- typed parameters without default values
- return types other than the default `type(*)`
- `@function` definitions inside `@container` or `@scope`
- `@function` definitions inside a `@layer` that is itself inside a conditional group rule
- `@function` definitions inside a style rule
- definitions whose body contains anything other than declarations and conditional group rules
- `result` descriptors that resolve to a CSS-wide keyword through a conditional rule or a `var()` fallback
- validation that a typed default value matches its parameter type

Definitions inside `@layer`, `@media` and `@supports` are supported. When a name
has several active definitions, the browser cascade selects the strongest one.

Unsupported definitions are left as-is. A definition is only removed when every
call site is transformed by this plugin, so call sites that are left as-is (for
example inside `@keyframes` or a nested conditional declaration) keep their
definitions.

Untyped parameters with default values are supported and may use any value,
including relative units and `var()` references.

Typed parameters with default values are checked by the browser through a
generated `@property` registration. A default value that is not
computationally independent (for example `1em` or `var(--x)`) can not be used
as an `initial-value` and makes the function unsupported.

```css
@function --negative(--value) {
	result: calc(-1 * var(--value));
}

@function --double(--value <length>: 1px) {
	result: calc(2 * var(--value));
}

html {
	--gap: 1em;
	padding: --negative(var(--gap));
	margin: --double(4px);
}

/* becomes */

html {
	--gap: 1em;
	--_csstools-cf-1agle9gi-1-arg-0: var(--gap);
	--_csstools-cf-1agle9gi-0-result: calc(-1 * var(--_csstools-cf-1agle9gi-1-arg-0));
	padding: var(--_csstools-cf-1agle9gi-0-result);
	--_csstools-cf-1agle9gi-3-arg-0: 4px;
	--_csstools-cf-1agle9gi-2-result: calc(2 * var(--_csstools-cf-1agle9gi-3-arg-0));
	margin: var(--_csstools-cf-1agle9gi-2-result);
}
@property --_csstools-cf-1agle9gi-3-arg-0 {
	syntax: "<length>";
	inherits: false;
	initial-value: 1px;
}
```

## Usage

Add [PostCSS Custom Functions] to your project:

```bash
npm install postcss @csstools/postcss-custom-functions --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomFunctions = require('@csstools/postcss-custom-functions');

postcss([
	postcssCustomFunctions(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Functions] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssCustomFunctions({ preserve: true })
```

```css
@function --negative(--value) {
	result: calc(-1 * var(--value));
}

@function --double(--value <length>: 1px) {
	result: calc(2 * var(--value));
}

html {
	--gap: 1em;
	padding: --negative(var(--gap));
	margin: --double(4px);
}

/* becomes */

@function --negative(--value) {
	result: calc(-1 * var(--value));
}

@function --double(--value <length>: 1px) {
	result: calc(2 * var(--value));
}

html {
	--gap: 1em;
	--_csstools-cf-1agle9gi-1-arg-0: var(--gap);
	--_csstools-cf-1agle9gi-0-result: calc(-1 * var(--_csstools-cf-1agle9gi-1-arg-0));
	padding: var(--_csstools-cf-1agle9gi-0-result);
	padding: --negative(var(--gap));
	--_csstools-cf-1agle9gi-3-arg-0: 4px;
	--_csstools-cf-1agle9gi-2-result: calc(2 * var(--_csstools-cf-1agle9gi-3-arg-0));
	margin: var(--_csstools-cf-1agle9gi-2-result);
	margin: --double(4px);
}

@property --_csstools-cf-1agle9gi-3-arg-0 {
	syntax: "<length>";
	inherits: false;
	initial-value: 1px;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#custom-functions
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-custom-functions

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Functions]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-functions
[CSS Custom Functions and Mixins 1]: https://drafts.csswg.org/css-mixins-1/#function-rule
