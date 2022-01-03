# EXPERIMENTAL : CSS Has Pseudo for Browsers [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][EXPERIMENTAL CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[![Support Chat][git-img]][git-url]

⚠️ Experimental version of [CSS Has Pseudo](https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo)

[EXPERIMENTAL CSS Has Pseudo] lets you style elements relative to other elements in CSS,
following the [Selectors Level 4] specification.

```css
input {
  /* style an input */
}

body[\:has\(\:focus\)] {
  /* style an input without a value */
}
```

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

## Options

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

[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/css-has-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-has-pseudo

[EXPERIMENTAL CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/experimental/css-has-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has
