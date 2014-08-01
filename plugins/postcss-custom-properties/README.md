# postcss-custom-properties [![Build Status](https://travis-ci.org/postcss/postcss-custom-properties.png)](https://travis-ci.org/postcss/postcss-custom-properties)

A [PostCSS](https://github.com/postcss/postcss) plugin to polyfill the
[W3C-style CSS Custom Properties for cascading variables](http://www.w3.org/TR/css-variables/).

**N.B.** For now the polyfill _is not complete_. It currently just aims to provide a future-proof way of using a _limited subset_ of the features provided by native CSS variables.  

_[Checkout opened issue to know the state of this plugin](issues)._

Why not `postcss-vars` ? Because [there is already a plugin with this name](http://github.com/iamvdo/postcss-vars) that have severals bugs & untested code.
But I look forward to merge those 2 plugins & deprecate this one ([see opened issue](https://github.com/iamvdo/postcss-vars/issues/4)).

## Installation

```
npm install postcss-custom-properties
```

## Usage

```js
// dependencies
var fs = require('fs')
var postcss = require('postcss')
var customProperties = require('postcss-custom-properties')

// css to be processed
var css = fs.readFileSync('build/build.css', 'utf8')

// process css using postcss-custom-properties
var out = postcss(customProperties()).process(css).css
```

### Options

#### `preserve` (default: `false`)

Allow you to preserve custom properties & var() usage in output.

```js
var out = postcss(customProperties({preserve: true})).process(css).css
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE-MIT)
