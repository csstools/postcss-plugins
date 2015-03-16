# postcss-custom-properties [![Build Status](https://travis-ci.org/postcss/postcss-custom-properties.png)](https://travis-ci.org/postcss/postcss-custom-properties)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS Custom Properties for cascading variables](http://www.w3.org/TR/css-variables/) syntax to more compatible CSS.

**N.B.** The transformation _is not complete_. It currently just aims to provide a future-proof way of using a **limited subset (to top-level `:root` selector)** of the features provided by native CSS custom properties.  
Read [#1](https://github.com/postcss/postcss-custom-properties/issues/1) & [#9](https://github.com/postcss/postcss-custom-properties/issues/9) to know why this limitation exists.

Works great with [postcss-calc](https://github.com/postcss/postcss-calc).

## Installation

```console
$ npm install postcss-custom-properties
```

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

#### `variables` (default: `{}`)

Allow you to pass an object of variables for `:root`. These definitions will override any that exist in the CSS.
The keys are automatically prefixed with the CSS `--` to make it easier to share
variables in your codebase.

---

## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

```console
$ git clone https://github.com/postcss/postcss-custom-properties.git
$ git checkout -b patch-1
$ npm install
$ npm test
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
