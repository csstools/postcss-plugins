# PostCSS Dir Pseudo Class [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS Dir Pseudo Class] lets you use the `:dir()` pseudo-class to style by
directionality in CSS, following the [Selectors Level 4] specification.

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

### Maintain Specificity

Using [PostCSS Dir Pseudo Class] will not impact selector weight, but it will
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

Add [PostCSS Dir Pseudo Class] to your build tool:

```bash
npm install postcss-dir-pseudo-class --save-dev
```

#### Node

Use [PostCSS Dir Pseudo Class] to process your CSS:

```js
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';

postcssDirPseudoClass.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Dir Pseudo Class] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';

postcss([
  postcssDirPseudoClass()
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Dir Pseudo Class] in your Webpack configuration:

```js
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssDirPseudoClass(/* options */)
            ]
          } }
        ]
      }
    ]
  }
}
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Dir Pseudo Class] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssDirPseudoClass(/* options */)
  ])
).pipe(
  gulp.dest('.')
));
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS Dir Pseudo Class] in your Gruntfile:

```js
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssDirPseudoClass(/* options */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### dir

The `dir` option allows you presume a direction in your CSS. By default, this
is not specified and you are required to include a direction `[dir]` attribute
somewhere in your HTML, preferably on the `html` element.

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

### preserve

The `preserve` option determines whether the original `:dir()` rule should
remain in the CSS. By default, the rule is replaced by the fallback.

[cli-url]: https://travis-ci.org/jonathantneal/postcss-dir-pseudo-class
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-dir-pseudo-class.svg
[css-img]: https://jonathantneal.github.io/cssdb/badge/dir-pseudo-class.svg
[css-url]: https://jonathantneal.github.io/cssdb/#dir-pseudo-class
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[npm-url]: https://www.npmjs.com/package/postcss-dir-pseudo-class
[npm-img]: https://img.shields.io/npm/v/postcss-dir-pseudo-class.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-dir-pseudo-class
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-dir-pseudo-class.svg

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Dir Pseudo Class]: https://github.com/jonathantneal/postcss-dir-pseudo-class
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Selectors Level 4]: https://www.w3.org/TR/selectors-4/
