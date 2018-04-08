# PostCSS Focus Within [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Focus Within] lets you use the `:focus-within` pseudo-class in CSS,
following the [Selectors Level 4 specification].

It is the companion to the [focus-within polyfill].

```css
.my-form-field:focus-within label {
  background-color: yellow;
}

/* becomes */

.my-form-field[focus-within] label {
  background-color: yellow;
}

.my-form-field:focus-within label {
  background-color: yellow;
}
```

[PostCSS Focus Within] duplicates rules using the `:focus-within` pseudo-class
with a `[focus-within]` attribute selector, the same selector used by the
[focus-within polyfill]. This replacement selector can be changed using the
`replaceWith` option. Also, the preservation of the original `:focus-within`
rule can be disabled using the `preserve` option. 

## Usage

Add [PostCSS Focus Within] to your build tool:

```bash
npm install postcss-focus-within --save-dev
```

#### Node

Use [PostCSS Focus Within] to process your CSS:

```js
import focusWithin from 'postcss-focus-within';

focusWithin.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Focus Within] as a plugin:

```js
import postcss from 'gulp-postcss';
import focusWithin from 'postcss-focus-within';

postcss([
  focusWithin()
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Focus Within] in your Gulpfile:

```js
import focusWithin from 'postcss-focus-within';

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
            plugins: () => [ focusWithin() ]
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

Use [PostCSS Focus Within] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import focusWithin from 'postcss-focus-within';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    focusWithin()
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

Use [PostCSS Focus Within] in your Gruntfile:

```js
import focusWithin from 'postcss-focus-within';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       focusWithin()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### preserve

The `preserve` option defines whether the original selector should remain. By
default, the original selector is preserved.

```js
focusWithin({ preserve: false });
```

```css
.my-form-field:focus-within label {
  background-color: yellow;
}

/* becomes */

.my-form-field[focus-within] label {
  background-color: yellow;
}
```

### replaceWith

The `replaceWith` option defines the selector to replace `:focus-within`. By
default, the replacement selector is `[focus-within]`.

```js
focusWithin({ replaceWith: '.focus-within' });
```

```css
.my-form-field:focus-within label {
  background-color: yellow;
}

/* becomes */

.my-form-field.focus-within label {
  background-color: yellow;
}

.my-form-field:focus-within label {
  background-color: yellow;
}
```

[npm-url]: https://www.npmjs.com/package/postcss-focus-within
[npm-img]: https://img.shields.io/npm/v/postcss-focus-within.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-focus-within
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-focus-within.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-focus-within
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-focus-within.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/support-chat-blue.svg

[focus-within polyfill]: https://github.com/jonathantneal/focus-within
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Focus Within]: https://github.com/jonathantneal/postcss-focus-within
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Selectors Level 4 specification]: https://www.w3.org/TR/selectors-4/#the-focus-within-pseudo
