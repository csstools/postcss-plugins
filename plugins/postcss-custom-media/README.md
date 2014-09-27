# postcss-custom-media [![Build Status](https://travis-ci.org/postcss/postcss-custom-media.png)](https://travis-ci.org/postcss/postcss-custom-media)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS Custom Media Queries](http://dev.w3.org/csswg/mediaqueries/#custom-mq) syntax to more compatible CSS.

## Installation

    $ npm install postcss-custom-media

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

Using this `input.css`:

```css
@custom-media --small-viewport (max-width: 30em);

@media (--small-viewport) {
  /* styles for small viewport */
}
```

you will get:

```css
@media (max-width: 30em) {
  /* styles for small viewport */
}
```

Checkout [tests](test) for more examples.

### Options

#### `extensions` (default: `{}`)

Allows you to pass an object to define the `<media-query-list>` for each `<extension-name>`. These definitions will override any that exist in the CSS.

---

## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

    $ git clone https://github.com/postcss/postcss-custom-media.git
    $ git checkout -b patch-1
    $ npm install
    $ npm test

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
