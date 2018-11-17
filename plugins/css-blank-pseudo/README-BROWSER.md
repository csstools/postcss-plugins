# CSS Blank Pseudo for Browsers [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][CSS Blank Pseudo]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

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
const cssBlankPseudo = require('css-blank-pseudo');

cssBlankPseudo(document);
```

To support Internet Explorer 11, include the *browser-legacy* script:

```js
const cssBlankPseudo = require('css-blank-pseudo/legacy');

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

[cli-img]: https://img.shields.io/travis/csstools/css-blank-pseudo/master.svg
[cli-url]: https://travis-ci.org/csstools/css-blank-pseudo
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/css-blank-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-blank-pseudo

[CSS Blank Pseudo]: https://github.com/csstools/css-blank-pseudo
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#blank
