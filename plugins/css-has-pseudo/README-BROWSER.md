# CSS Has Pseudo for Browsers [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[CSS Has Pseudo] lets you style elements relative to other elements in CSS,
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

Add [CSS Has Pseudo] to your build tool:

```bash
npm install css-has-pseudo
```

Then include and initialize it on your document:

```js
const cssHasPseudo = require('css-has-pseudo/browser');

cssHasPseudo(document);
```

```html
<link rel="stylesheet" href="TRANSFORMED.css">
<script src="https://unpkg.com/css-has-pseudo/dist/browser-global.js"></script>
<script>cssHasPseudo(document)</script>
```

## Dependencies

Web API's:

- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) with support for post CSS 2.1 selectors

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
[npm-img]: https://img.shields.io/npm/v/css-has-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-has-pseudo

[CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has
