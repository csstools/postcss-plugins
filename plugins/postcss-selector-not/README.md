# postcss-selector-not [![CSS Standard Status](https://cssdb.org/images/badges/not-pseudo-class.svg)](https://cssdb.org/#not-pseudo-class) [<img alt="build status" src="https://github.com/postcss/postcss-selector-not/workflows/test/badge.svg" height="20">][cli-url]

> PostCSS plugin to transform `:not()` W3C CSS level 4 pseudo class to :not() CSS level 3 selectors

http://dev.w3.org/csswg/selectors-4/#negation

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-not-sel-list.png)](https://caniuse.com/#feat=css-not-sel-list)

## Installation

```console
$ npm install postcss postcss-selector-not
```

## Usage

Using this `input.css`:

```css
p:not(:first-child, .special) {
  color: red;
}
```

you will get:

```css
p:not(:first-child):not(.special) {
  color: red;
}
```

---

## [Changelog](CHANGELOG.md)

## [License](LICENSE)

[cli-url]: https://github.com/postcss/postcss-selector-not/actions/workflows/test.yml?query=workflow/test
