# EXPERIMENTAL : CSS Has Pseudo for Browsers [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][EXPERIMENTAL CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

⚠️ Experimental version of [CSS Has Pseudo](https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo)

[EXPERIMENTAL CSS Has Pseudo] lets you style elements relative to other elements in CSS,
following the [Selectors Level 4] specification.

## Usage

Add [EXPERIMENTAL CSS Has Pseudo] to your build tool:

```bash
npm install @csstools/css-has-pseudo-experimental
```

Then include and initialize it on your document:

```js
const cssHasPseudo = require('@csstools/css-has-pseudo-experimental/browser');

cssHasPseudo(document);
```

```html
<link rel="stylesheet" href="TRANSFORMED.css">
<script src="https://unpkg.com/@csstools/css-has-pseudo-experimental/dist/browser-global.js"></script>
<script>cssHasPseudo(document)</script>
```

⚠️ Please use a versioned url, like this : `https://unpkg.com/@csstools/css-has-pseudo-experimental@0.2.0/dist/browser-global.js`
Without the version, you might unexpectedly get a new major version of the library with breaking changes.

## CORS

⚠️ Applies to you if you load CSS from a different domain than the page.
In this case the CSS is treated as untrusted and will not be made available to the Javascript polyfill.

Example :

| page | css | CORS applies |
| --- | --- | --- |
| https://example.com/ | https://example.com/style.css | no |
| https://example.com/ | https://other.com/style.css | yes |

**You might see one of these error messages :**

```html
<!-- Use the `debug` option to make the polyfill emit errors. -->
<script>cssHasPseudo(document, { debug: true })</script>
```

Chrome :

> DOMException: Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules

Safari :

> SecurityError: Not allowed to access cross-origin stylesheet

Firefox :

> DOMException: CSSStyleSheet.cssRules getter: Not allowed to access cross-origin stylesheet

To resolve CORS errors you need to take two steps :

- add HTTP header `Access-Control-Allow-Origin: <your-value>` to your CSS file.
- add `crossorigin="anonymous"` to the `<link rel="stylesheet">` tage for your CSS file.

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

## Options

### debug

The `debug` option determines if errors are emitted to the console in browser.
By default the polyfill will not emit errors or warnings.

```js
cssHasPseudo(document, { debug: true });
```

### hover

The `hover` option determines if `:hover` pseudo-class should be tracked.
This is disabled by default because it is an expensive operation.

```js
cssHasPseudo(document, { hover: true });
```

### observedAttributes

The `observedAttributes` option determines which html attributes are observed.
If you do any client side modification of non-standard attributes and use these in combination with `:has()` you want to add these here.

```js
cssHasPseudo(document, { observedAttributes: ['something-not-standard'] });
```

### forcePolyfill

The `forcePolyfill` option determines if the polyfill is used even when the browser has native support.
This is needed when you set `preserve: false` in the PostCSS plugin config.

```js
cssHasPseudo(document, { forcePolyfill: true });
```

## Dependencies

Web API's:

- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) with support for post CSS 2.1 selectors and `:scope` selectors.

ECMA Script:

- `Array.prototype.filter`
- `Array.prototype.forEach`
- `Array.prototype.indexOf`
- `Array.prototype.join`
- `Array.prototype.map`
- `Array.prototype.splice`
- `RegExp.prototype.exec`
- `String.prototype.match`
- `String.prototype.replace`
- `String.prototype.split`

[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/@csstools/css-has-pseudo-experimental.svg
[npm-url]: https://www.npmjs.com/package/@csstools/css-has-pseudo-experimental

[EXPERIMENTAL CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/experimental/css-has-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has
