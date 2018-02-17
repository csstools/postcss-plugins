# PostCSS Focus Visible [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Focus Visible] lets you use the `:focus-visible` pseudo-selector in
CSS, following the [Selectors Level 4 specification].

```css
:focus:not(:focus-visible) {
  outline: none;
}

/* becomes */

:focus:not(.focus-visible) {
  outline: none;
}
```

[PostCSS Focus Visible] replaces the `:focus-visible` pseudo-selector with a
`.focus-visible` class selector, the same selector used by the
[focus-visible polyfill]. The replacement selector can be changed using the
`replaceWith` option.

## Usage

Add [PostCSS Focus Visible] to your build tool:

```bash
npm install postcss-focus-visible --save-dev
```

#### Node

Use [PostCSS Focus Visible] to process your CSS:

```js
import focusVisible from 'postcss-focus-visible';

focusVisible.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Focus Visible] as a plugin:

```js
import postcss from 'gulp-postcss';
import focusVisible from 'postcss-focus-visible';

postcss([
  focusVisible()
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Focus Visible] in your Gulpfile:

```js
import focusVisible from 'postcss-focus-visible';

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
            plugins: () => [ focusVisible() ]
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

Use [PostCSS Focus Visible] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import focusVisible from 'postcss-focus-visible';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    focusVisible()
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

Use [PostCSS Focus Visible] in your Gruntfile:

```js
import focusVisible from 'postcss-focus-visible';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       focusVisible()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### replaceWith

The `replaceWith` option defines the selector to replace `:focus-visible`. By
default, the replacement selector is `.focus-visible`.

```js
focusVisible({ replaceWith: '[data-focus-visible-added]' });
```

```css
:focus:not(:focus-visible) {
  outline: none;
}

/* becomes */

:focus:not([data-focus-visible-added]) {
  outline: none;
}
```

[npm-url]: https://www.npmjs.com/package/postcss-focus-visible
[npm-img]: https://img.shields.io/npm/v/postcss-focus-visible.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-focus-visible
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-focus-visible.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-focus-visible
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-focus-visible.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[focus-visible polyfill]: https://github.com/WICG/focus-visible
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Focus Visible]: https://github.com/jonathantneal/postcss-focus-visible
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Selectors Level 4 specification]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
