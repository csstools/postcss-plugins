# CSS Blank Pseudo for Browsers [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][CSS Blank Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[CSS Blank Pseudo] lets you style form elements when they are empty, following
the [Selectors Level 4] specification.

```css
input {
  /* style an input */
}

input[blank] {
  /* style an input without a value */
}
```

## Usage

Add [CSS Blank Pseudo] to your build tool:

```bash
npm install css-blank-pseudo
```

Then include and initialize it on your document:

```js
const cssBlankPseudo = require('css-blank-pseudo/browser');

cssBlankPseudo(document);
```

## Options

[CSS Blank Pseudo] accepts a secondary paramater to configure the attribute or
class name added to elements matching focused elements or containing focused
elements.

```js
cssBlankPseudo(document, {
  attr: false,
  className: '.blank'
});
```

Falsey values on either `attr` or `className` will disable setting the
attribute or class name on elements matching `:blank`.

[CSS Blank Pseudo] also accepts a secondary paramater to configure whether the
polyfill is loaded regardless of support. If `force` is given a truthy value,
then the polyfill will always execute.

```js
cssBlankPseudo(document, {
  force: true
});
```

## Dependencies

Web API's:

- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

ECMA Script:

- `Object.prototype.toString`
- `Object.getOwnPropertyDescriptor`
- `Object.defineProperty`
- `Array.prototype.forEach`


[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/css-blank-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-blank-pseudo

[CSS Blank Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#blank
