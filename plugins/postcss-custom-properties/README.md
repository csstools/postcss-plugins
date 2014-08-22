# postcss-custom-properties [![Build Status](https://travis-ci.org/postcss/postcss-custom-properties.png)](https://travis-ci.org/postcss/postcss-custom-properties)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS Custom Properties for cascading variables](http://www.w3.org/TR/css-variables/) syntax to more compatible CSS.

**N.B.** For now the transformation _is not complete_. It currently just aims to provide a future-proof way of using a _limited subset_ of the features provided by native CSS variables.  

_[Checkout opened issue to know the state of this plugin](issues)._

Why not `postcss-vars` ? Because [there is already a plugin with this name](http://github.com/iamvdo/postcss-vars) that have severals bugs & untested code.
But I look forward to merge those 2 plugins & deprecate this one ([see opened issue](https://github.com/iamvdo/postcss-vars/issues/4)).

## Installation

    $ npm install postcss-custom-properties

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var customProperties = require("postcss-custom-properties")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css using postcss-custom-properties
var output = postcss()
  .use(customProperties())
  .process(css)
  .css
```

Using this `input.css`:

```css
:root {
  --color: red;
}

div {
  color: var(--color);
}
```

you will get:

```css
div {
  color: red;
}
```

Checkout [tests](test) for more.

### Options

#### `preserve` (default: `false`)

Allow you to preserve custom properties & var() usage in output.

```js
var out = postcss()
  .use(customProperties({preserve: true}))
  .process(css)
  .css
```

#### `map` (default: `{}`)

Allow you to pass an object of variables

---

## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

    $ git clone https://github.com/postcss/postcss-custom-properties.git
    $ git checkout -b patch-1
    $ npm install
    $ npm test

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
