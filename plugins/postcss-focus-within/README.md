# PostCSS Focus Within [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-focus-within.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/focus-within-pseudo-class.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Focus Within] lets you use the `:focus-within` pseudo-class in CSS, 
following the [Selectors Level 4 specification].

```pcss
.my-form-field:focus-within label {
	background-color: yellow;
}

/* becomes */

.my-form-field[focus-within].js-focus-within label, .js-focus-within .my-form-field[focus-within] label {
	background-color: yellow;
}
```

[PostCSS Focus Within] duplicates rules using the `:focus-within` pseudo-class
with a `[focus-within]` attribute selector, the same selector used by the
focus-within polyfill. This replacement selector can be changed using the
`replaceWith` option. Also, the preservation of the original `:focus-within`
rule can be disabled using the `preserve` option.

## Usage

Add [PostCSS Focus Within] to your project:

```bash
npm install postcss postcss-focus-within --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFocusWithin = require('postcss-focus-within');

postcss([
	postcssFocusWithin(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Focus Within] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is preserved.

```js
postcssFocusWithin({ preserve: false })
```

```pcss
.my-form-field:focus-within label {
	background-color: yellow;
}

/* becomes */

.my-form-field[focus-within].js-focus-within label, .js-focus-within .my-form-field[focus-within] label {
	background-color: yellow;
}
```

### replaceWith

The `replaceWith` option defines the selector to replace `:focus-within`. By
default, the replacement selector is `[focus-within]`.

```js
postcssFocusWithin({ replaceWith: '.focus-within' });
```

```pcss
.my-form-field:focus-within label {
	background-color: yellow;
}

/* becomes */

.my-form-field.focus-within.js-focus-within label, .js-focus-within .my-form-field.focus-within label {
	background-color: yellow;
}
```

Note that changing this option implies that it needs to be passed to the
browser polyfill as well.

## Browser

```js
import focusWithinInit from 'postcss-focus-within/browser';

focusWithinInit();
```

or

```html
<!-- When using a CDN url you will have to manually update the version number -->
<script src="https://unpkg.com/postcss-focus-within@5.0.4/dist/browser-global.js"></script>
<script>focusWithinInit()</script>
```

[PostCSS Focus Within] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any additional polyfills.

### Browser Usage

#### force

The `force` option determines whether the library runs even if the browser
supports the selector or not. By default, it won't run if the browser does
support the selector.

```js
focusWithinInit({ force: true });
```

#### replaceWith

Similar to the option for the PostCSS Plugin, `replaceWith` determines the
attribute or class to apply to an element when it's considered to be `:focus-within`.

```js
focusWithinInit({ replaceWith: '.focus-within });
```

This option should be used if it was changed at PostCSS configuration level.

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#focus-within-pseudo-class
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-focus-within

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Focus Within]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-focus-within
[Selectors Level 4 specification]: https://www.w3.org/TR/selectors-4/#the-focus-within-pseudo
