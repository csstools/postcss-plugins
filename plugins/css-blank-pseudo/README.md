<!-- Available Variables: -->
<!-- Blank Pseudo PostCSS Your Plugin -->
<!-- blankPseudo postcssYourPlugin -->
<!-- css-blank-pseudo @csstools/postcss-your-plugin -->
<!-- plugins/css-blank-pseudo plugins/postcss-your-plugin -->
<!-- blank-pseudo-class your-feature -->
<!-- https://www.w3.org/TR/selectors-4/#blank https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- input:blank {
	background-color: yellow;
} file contents for examples/example.css -->
<!-- # Blank Pseudo [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/css-blank-pseudo.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/blank-pseudo-class.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord] -->
<!-- ## Usage

Add [Blank Pseudo] to your project:

```bash
npm install postcss css-blank-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const blankPseudo = require('css-blank-pseudo');

postcss([
	blankPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
``` usage instructions -->
<!-- [Blank Pseudo] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- | -->
<!-- ## CORS

⚠️ Applies to you if you load CSS from a different domain than the page.

In this case the CSS is treated as untrusted and will not be made available to the JavaScript polyfill.
The polyfill will not work without applying the correct configuration for CORS.

Example :

| page | css | CORS applies |
| --- | --- | --- |
| https://example.com/ | https://example.com/style.css | no |
| https://example.com/ | https://other.com/style.css | yes |


**You might see one of these error messages :**

Chrome :

> DOMException: Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules

Safari :

> SecurityError: Not allowed to access cross-origin stylesheet

Firefox :

> DOMException: CSSStyleSheet.cssRules getter: Not allowed to access cross-origin stylesheet

To resolve CORS errors you need to take two steps :

- add an HTTP header `Access-Control-Allow-Origin: <your-value>` when serving your CSS file.
- add `crossorigin="anonymous"` to the `<link rel="stylesheet">` tag for your CSS file.

In a node server setting the HTTP header might look like this :

```js
// http://localhost:8080 is the domain of your page!
res.setHeader('Access-Control-Allow-Origin', 'https://example.com');
```

You can also configure a wildcard but please be aware that this might be a security risk.
It is better to only set the header for the domain you want to allow and only on the responses you want to allow.

HTML might look like this :

```html
<link rel="stylesheet" href="https://example.com/styles.css" crossorigin="anonymous">
```
 -->
<!-- [cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#blank-pseudo-class
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/css-blank-pseudo

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Blank Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo -->
<!-- to generate : npm run docs -->

<header>

[Blank Pseudo] lets you style form elements when they are empty, following 
the [Selectors Level 4] specification.

```pcss
input:blank {
	background-color: yellow;
}

/* becomes */

input[blank] {
	background-color: yellow;
}
input:blank {
	background-color: yellow;
}
```

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is preserved.

```js
blankPseudo({ preserve: false })
```

```pcss
input:blank {
	background-color: yellow;
}

/* becomes */

input[blank] {
	background-color: yellow;
}
```

### replaceWith

The `replaceWith` option determines the selector to use when replacing
the `:blank` pseudo. By default is `[blank]`

```js
blankPseudo({ replaceWith: '.css-blank' })
```

```pcss
input:blank {
	background-color: yellow;
}

/* becomes */

.foo {
	color: blue;
	color: red;
}

.baz {
	color: green;
}
```

Note that changing this option implies that it needs to be passed to the
browser polyfill as well.

## Browser

```js
import cssBlankPseudoInit from 'css-blank-pseudo/browser';

cssBlankPseudoInit();
```

or

```html
<!-- When using a CDN url you will have to manually update the version number -->
<script src="https://unpkg.com/css-blank-pseudo@3.0.3/dist/browser-global.js"></script>
<script>cssBlankPseudoInit()</script>
```

[Blank Pseudo] works in all major browsers, including Safari 6+ and
Internet Explorer 9+ without any additional polyfills.

### Browser Usage

#### force

The `force` option determines whether the library runs even if the browser 
supports the selector or not. By default, it won't run if the browser does
support the selector.

```js
cssBlankPseudoInit({ force: true });
```

#### replaceWith

Similar to the option for the PostCSS Plugin, `replaceWith` determines the
attribute or class to apply to an element when it's considered to be `:blank`.

```js
cssBlankPseudoInit({ replaceWith: '.css-blank' });
```

This option should be used if it was changed at PostCSS configuration level.

<linkList>
[Selectors Level 4]: https://www.w3.org/TR/selectors-4/#blank
