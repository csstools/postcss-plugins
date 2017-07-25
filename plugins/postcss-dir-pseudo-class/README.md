# PostCSS :dir() [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS :dir()] lets you use the `:dir` pseudo-class in CSS.

```css
.example:dir(rtl) {
  margin-right: 10px;
}

.example:dir(ltr) {
  margin-left: 10px;
}

/* becomes */

[dir="rtl"] .example {
  margin-right: 10px;
}

[dir="ltr"] .example {
  margin-left: 10px;
}
```

If your [browserslist] already supports the `:dir` pseudo-class, this plugin
will not change your CSS. You can learn more this by reading about the
[`browsers` option](#browsers-option).

By default, this plugin requires you to specify a direction `[dir]` attribute
in your HTML, preferably on the `html` element. If you prefer not to, you
can presume a direction in your CSS using the [`dir` option](#dir-option).

## Usage

Add [PostCSS :dir()] to your build tool:

```bash
npm install postcss-dir-pseudo-class --save-dev
```

#### Node

Use [PostCSS :dir()] to process your CSS:

```js
require('postcss-dir-pseudo-class').process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS :dir()] as a plugin:

```js
postcss([
  require('postcss-dir-pseudo-class')()
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS :dir()] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-dir-pseudo-class')()
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

Use [PostCSS :dir()] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-dir-pseudo-class')()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

---

## browsers option

If your [browserslist] already supports the `:dir` pseudo-class, this plugin
will not change your CSS. While only Firefox currently supports `:dir`, this
will surely improve over time.

Here’s an example of a `package.json` using a browserslist that would fully
support the `:dir` pseudo-class:

```json
{
  "browserslist": "firefox >= 49"
}
```

And here’s an example of using the `browsers` option to accomplish the same
thing:

```js
require('postcss-dir-pseudo-class')({
  browsers: 'firefox >= 49'
});
```

In both of these examples, the CSS would remain unchanged.

```css
.example:dir(rtl) {
  margin-right: 10px;
}

/* becomes */

.example:dir(rtl) {
  margin-right: 10px;
}
```

## dir option

By default, this plugin requires you to specify a direction `[dir]` attribute
in your HTML, preferably on the `html` element. If you prefer not to, you
can presume a direction in your CSS using the `dir` option.

Here’s an example of using the `dir` option to presume a left-to-right
direction:

```js
require('postcss-dir-pseudo-class')({
  dir: 'ltr'
});
```

```css
.example:dir(ltr) {
  margin-left: 10px;
}

.example:dir(rtl) {
  margin-right: 10px;
}

/* becomes */

:not([dir="rtl"]) .example {
  margin-left: 10px;
}

[dir="rtl"] .example {
  margin-right: 10px;
}
```

*Note: The `:root` pseudo-class is added here to preserve the weight of the
original selector.*

[npm-url]: https://www.npmjs.com/package/postcss-dir-pseudo-class
[npm-img]: https://img.shields.io/npm/v/postcss-dir-pseudo-class.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-dir-pseudo-class
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-dir-pseudo-class.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-dir-pseudo-class
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-dir-pseudo-class.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS :dir()]: https://github.com/jonathantneal/postcss-dir-pseudo-class
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[browserslist]: https://github.com/ai/browserslist
