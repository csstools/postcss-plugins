# PostCSS Focus Ring [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Focus Ring] lets you use the `:focus-visible` pseudo-selector in CSS,
following the [Selectors Level 4] specification.

```css
:focus:not(:focus-visible) {
  outline: none;
}
```

Use PostCSS Focus Ring alongside the [focus-visible polyfill] to swap the
pseudo-selector for a class, which maintains the same selector weight.

```css
:focus:not(.focus-visible) {
  outline: none;
}
```

---

Additionally, transformed selectors can be exported to a JSON file.

```js
require('postcss-focus-ring')({
  exportAs: 'json'
});
```

```json
[
  ".focus-visible",
  ".x-component-outside .focus-visible",
  ".focus-visible .x-component-inside",
]
```

Or as a JavaScript export:

```js
require('postcss-focus-ring')({
  exportAs: 'js'
});
```

```js
export default [
  ".focus-visible",
  ".x-component-outside .focus-visible",
  ".focus-visible .x-component-inside",
];
```

With these variables synchronized to JavaScript, they can be used alongside the
[focus-visible polyfill].

## Usage

Add [PostCSS Focus Ring] to your build tool:

```bash
npm install postcss-focus-ring --save-dev
```

#### Node

Use [PostCSS Focus Ring] to process your CSS:

```js
require('postcss-focus-ring').process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Focus Ring] as a plugin:

```js
postcss([
  require('postcss-focus-ring')()
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Focus Ring] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-focus-ring')()
    ])
  ).pipe(
    gulp.dest('.')
  );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS Focus Ring] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-focus-ring')()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Advanced Options

These options may be passed directly into the plugin.

```js
require('postcss-focus-ring')({ /* options */ });
```

#### exportAs

`exportAs` is used to export transformed selectors originally containing the
`:focus-visible` pseudo-selector.

- If a `js` string is passed, the selectors will be exported as JavaScript.
- If a `json` string is passed, the selectors will be exported as JSON.

#### exportTo

`exportTo` is the path to where your JSON or JavaScript will be saved. By
default, it is the CSS source file with an additional `focus-visible-selectors`
and `.js` or `.json` extension.

#### assignTo

`assignTo` is an Array you may push your transformed selectors to. This can
be useful if running the plugin on the client side.

[npm-url]: https://www.npmjs.com/package/postcss-focus-ring
[npm-img]: https://img.shields.io/npm/v/postcss-focus-ring.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-focus-ring
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-focus-ring.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-focus-ring
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-focus-ring.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS Focus Ring]: https://github.com/jonathantneal/postcss-focus-ring
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
[focus-visible polyfill]: https://github.com/WICG/focus-ring
