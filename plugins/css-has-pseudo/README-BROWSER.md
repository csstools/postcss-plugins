# CSS Has Pseudo for Browsers [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

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
const cssHasPseudo = require('css-has-pseudo');

cssHasPseudo(document);
```

[cli-img]: https://img.shields.io/travis/csstools/css-has-pseudo/master.svg
[cli-url]: https://travis-ci.org/csstools/css-has-pseudo
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/css-has-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-has-pseudo

[CSS Has Pseudo]: https://github.com/csstools/css-has-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has
