# PostCSS Logical Properties and Values [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![CSS Standard Status][css-img]][css-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Logical Properties and Values] lets you use logical, rather than
physical, direction and dimension mappings in CSS, following the
[CSS Logical Properties and Values] specification.

```pcss
.banner {
  color: #222222;
  inset: logical 0 5px 10px;
  padding-inline: 20px 40px;
  resize: block;
  transition: color 200ms;
}

/* becomes */

.banner {
  color: #222222;
  top: 0; left: 5px; bottom: 10px; right: 5px;

  &:dir(ltr) {
    padding-left: 20px; padding-right: 40px;
  }
  
  &:dir(rtl) {
    padding-right: 20px; padding-left: 40px;
  }

  resize: vertical;
  transition: color 200ms;
}

/* or, when used with { dir: 'ltr' } */

.banner {
  color: #222222;
  top: 0; left: 5px; bottom: 10px; right: 5px;
  padding-left: 20px; padding-right: 40px;
  resize: vertical;
  transition: color 200ms;
}

/* or, when used with { preserve: true } */

.banner {
  color: #222222;
  top: 0; left: 5px; bottom: 10px; right: 5px;

  &:dir(ltr) {
    padding-left: 20px; padding-right: 40px;
  }

  &:dir(rtl) {
    padding-right: 20px; padding-left: 40px;
  }

  inset: logical 0 5px 10px;
  padding-inline: 20px 40px;
  resize: block;
  resize: vertical;
  transition: color 200ms;
}
```

These shorthand properties set values for physical properties by default.
Specifying the `logical` keyboard at the beginning of the property value will
transform the flow-relative values afterward into both physical LTR and RTL
properties:

#### Logical Borders

- `border`, `border-block`, `border-block-start`, `border-block-end`,
  `border-inline`, `border-inline-start`, `border-inline-end`, `border-start`,
  `border-end`, `border-color`, `border-block-color`,
  `border-block-start-color`, `border-block-end-color`, `border-inline-color`,
  `border-inline-start-color`, `border-inline-end-color`, `border-start-color`,
  `border-end-color`, `border-style`, `border-block-style`,
  `border-block-start-style`, `border-block-end-style`, `border-inline-style`,
  `border-inline-start-style`, `border-inline-end-style`, `border-start-style`,
  `border-end-style`, `border-width`, `border-block-width`,
  `border-block-start-width`, `border-block-end-width`, `border-inline-width`,
  `border-inline-start-width`, `border-inline-end-width`, `border-start-width`,
  `border-end-width`

#### Logical Offsets

- `inset`, `inset-block`, `inset-block-start`, `inset-block-end`,
  `inset-inline`, `inset-inline-start`, `inset-inline-end`, `inset-start`,
  `inset-end`

#### Logical Margins

- `margin`, `margin-block`, `margin-block-start`, `margin-block-end`,
  `margin-inline`, `margin-inline-start`, `margin-inline-end`, `margin-start`,
  `margin-end`

#### Logical Paddings

- `padding`, `padding-block`, `padding-block-start`, `padding-block-end`,
  `padding-inline`, `padding-inline-start`, `padding-inline-end`,
  `padding-start`, `padding-end`

#### Logical Sizes

- `block-size`, `inline-size`

#### Flow-Relative Values

- `clear: inline-start`, `clear: inline-end`, `float: inline-start`,
  `float: inline-end`, `text-align: start`, `text-align: end`

---

By default, [PostCSS Logical Properties and Values] creates fallback selectors
which require at least one `[dir]` attribute in your HTML. If you don’t have
any `[dir]` attributes, consider using the following JavaScript:

```js
// force at least one dir attribute (this can run at any time)
document.documentElement.dir=document.documentElement.dir||'ltr';
```

Otherwise, consider using the `dir` option to transform all logical properties
and values to a specific direction.

```js
require('postcss-logical')({
  dir: 'ltr'
});
```

## Usage

Add [PostCSS Logical Properties and Values] to your build tool:

```bash
npm install postcss-logical --save-dev
```

#### Node

Use [PostCSS Logical Properties and Values] to process your CSS:

```js
import postcssLogical from 'postcss-logical';

postcssLogical.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Logical Properties and Values] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssLogical from 'postcss-logical';

postcss([
  postcssLogical(/* options */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Logical Properties and Values] in your Webpack configuration:

```js
import postcssLogical from 'postcss-logical';

export default {
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
              postcssLogical(/* options */)
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

Use [PostCSS Logical Properties and Values] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssLogical from 'postcss-logical';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssLogical(/* options */)
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

Use [PostCSS Logical Properties and Values] in your Gruntfile:

```js
import postcssLogical from 'postcss-logical';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssLogical(/* options */)
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

The `dir` option determines how directional fallbacks should be added to CSS.
By default, fallbacks replace the logical declaration with nested `:dir`
pseudo-classes. If `dir` is defined as `ltr` or `rtl` then only the left or
right directional fallbacks will replace the logical declarations. If
`preserve` is defined as `true`, then the `dir` option will be ignored.

### preserve

The `preserve` option determines whether directional fallbacks should be added
before logical declarations without replacing them. By default, directional
fallbacks replace logical declaration. If `preserve` is defined as `true`, then
the `dir` option will be ignored.

[cli-url]: https://travis-ci.org/jonathantneal/postcss-logical
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-logical.svg
[css-img]: https://jonathantneal.github.io/css-db/badge/css-logical.svg
[css-url]: https://jonathantneal.github.io/css-db/#css-logical
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg
[npm-url]: https://www.npmjs.com/package/postcss-logical
[npm-img]: https://img.shields.io/npm/v/postcss-logical.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-logical
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-logical.svg

[CSS Logical Properties and Values]: https://drafts.csswg.org/css-logical/
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Logical Properties and Values]: https://github.com/jonathantneal/postcss-logical
