# PostCSS Custom Media [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

> [PostCSS Custom Media] lets you use Custom Media Queries in CSS, following
the [CSS Media Queries](https://drafts.csswg.org/mediaqueries-5/#custom-mq)
specification.

```pcss
@custom-media --small-viewport (max-width: 30em);

@media (--small-viewport) {
  /* styles for small viewport */
}

/* becomes */

@media (max-width: 30em) {
  /* styles for small viewport */
}
```

## Installation

```console
$ npm install postcss-custom-media
```

## Usage

```js
// dependencies
var postcss = require("postcss")
var customMedia = require("postcss-custom-media")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css using postcss-custom-media
var out = postcss()
  .use(customMedia())
  .process(css)
  .css
```

Checkout [tests](test) for more examples.

### Options

#### `extensions`

(default: `{}`)

Allows you to pass an object to define the `<media-query-list>` for each
`<extension-name>`. These definitions will override any that exist in the CSS.

```javascript
{
  '--phone': '(min-width: 544px)',
  '--tablet': '(min-width: 768px)',
  '--desktop': '(min-width: 992px)',
  '--large-desktop': '(min-width: 1200px)',
}
```

#### `preserve`

(default: `false`)

Allows you to preserve custom media query definitions in output.

#### `appendExtensions`

(default: `false`)

**This option only works if `preserve` is truthy**.
Allows you to append your extensions at end of your CSS.

---

## [Changelog](CHANGELOG.md)

## [License](LICENSE)

[cli-img]: https://img.shields.io/travis/postcss/postcss-custom-media.svg
[cli-url]: https://travis-ci.org/postcss/postcss-custom-media
[css-img]: https://cssdb.org/badge/custom-media-queries.svg
[css-url]: https://cssdb.org/#custom-media-queries
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-custom-media.svg
[npm-url]: https://www.npmjs.com/package/postcss-custom-media

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Media]: https://github.com/postcss/postcss-custom-media
