# postcss-custom-media [![CSS Standard Status](https://jonathantneal.github.io/css-db/badge/mediaqueries-5-custom-mq.svg)](https://jonathantneal.github.io/css-db/#mediaqueries-5-custom-mq) [![Build Status](https://travis-ci.org/postcss/postcss-custom-media.png)](https://travis-ci.org/postcss/postcss-custom-media)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS Custom Media Queries](https://drafts.csswg.org/mediaqueries-5/#custom-mq) syntax to more compatible CSS.

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
