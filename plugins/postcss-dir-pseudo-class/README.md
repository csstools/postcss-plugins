# PostCSS :dir() Pseudo [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![CSS Standard Status][css-img]][css-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-img]][lic-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS :dir() Pseudo] lets you use the `:dir()` pseudo-class to style by
directionality in CSS, following the [Selectors] specification.

```css
article h3:dir(rtl) {
  margin-right: 10px;
}

article h3:dir(ltr) {
  margin-left: 10px;
}

/* becomes */

[dir="rtl"] article h3 {
  margin-right: 10px;
}

[dir="ltr"] article h3 {
  margin-left: 10px;
}
```

### Future-proof your CSS

If your [browserslist] already supports the `:dir()` pseudo-class, this plugin
will not change your CSS. Learn more about this feature in the
[`browsers`](#browsers-option) section.

### Maintain Specificity

Using [PostCSS :dir() Pseudo] will not impact selector weight, but it will
require having at least one `[dir]` attribute in your HTML. If you don’t have
_any_ `[dir]` attributes, consider using the following JavaScript:

```js
// force at least one dir attribute (this can run at any time)
document.documentElement.dir=document.documentElement.dir||'ltr';
```

If you absolutely cannot add a `[dir]` attribute in your HTML or even force one
via JavaScript, you can still work around this by presuming a direction in your
CSS using the [`dir` option](#dir-option), but understand that this will
sometimes increase selector weight by one element (`html`).

## Usage

Add [PostCSS :dir() Pseudo] to your build tool:

```bash
npm install postcss-dir-pseudo-class --save-dev
```

#### Node

Use [PostCSS :dir() Pseudo] to process your CSS:

```js
require('postcss-dir-pseudo-class').process(YOUR_CSS /*, processConfig, options */);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS :dir() Pseudo] as a plugin:

```js
postcss([
  require('postcss-dir-pseudo-class')(/* Options */)
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS :dir() Pseudo] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-dir-pseudo-class')(/* Options */)
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

Use [PostCSS :dir() Pseudo] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-dir-pseudo-class')(/* Options */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

---

## Browsers Option

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

## Dir Option

By default, this plugin requires you to include a direction `[dir]` attribute
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

html:not([dir="rtl"]) .example {
  margin-left: 10px;
}

[dir="rtl"] .example {
  margin-right: 10px;
}
```

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
[PostCSS :dir() Pseudo]: https://github.com/jonathantneal/postcss-dir-pseudo-class
[Selectors]: https://drafts.csswg.org/selectors-4/#the-dir-pseudo
