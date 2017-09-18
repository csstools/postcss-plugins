# PostCSS :dir() [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![CSS Standard Status][css-img]][css-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-img]][lic-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS :dir()] lets you use the `:dir` pseudo-class in CSS, following the
[Selectors] specification.

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

[PostCSS :dir()] does not change selector weight, but does require at least one
`[dir]` attribute in your HTML. If you don’t have _any_ `[dir]` attributes,
consider using the following JavaScript:

```js
// force at least one dir attribute (this can run at any time)
document.documentElement.dir=document.documentElement.dir||'ltr';
```

If you absolutely cannot add a `[dir]` attribute in your HTML or force one via
JavaScript, you can still get around this by presuming a direction in your CSS
using the [`dir` option](#dir-option), but know that this will increase
selector weight by one element (`html`).

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

[cli-url]: https://travis-ci.org/jonathantneal/postcss-dir-pseudo-class
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-dir-pseudo-class.svg
[css-img]: https://jonathantneal.github.io/css-db/badge/selectors-the-dir-pseudo.svg
[css-url]: https://jonathantneal.github.io/css-db/#selectors-the-dir-pseudo
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg
[lic-url]: LICENSE.md
[lic-img]: https://img.shields.io/npm/l/postcss-dir-pseudo-class.svg
[npm-url]: https://www.npmjs.com/package/postcss-dir-pseudo-class
[npm-img]: https://img.shields.io/npm/v/postcss-dir-pseudo-class.svg

[browserslist]: https://github.com/ai/browserslist
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS :dir()]: https://github.com/jonathantneal/postcss-dir-pseudo-class
[Selectors]: https://drafts.csswg.org/selectors-4/#the-dir-pseudo
