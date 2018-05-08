# PostCSS Place Properties [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS Place Properties] lets you use `place-*` properties as shorthands for `align-*`
and `justify-*`, following the [CSS Box Alignment] specification.

```pcss
.example {
  place-self: center;
  place-content: space-between center;
}

/* becomes */

.example {
  align-self: center;
  justify-self: center;
  place-self: center;
  align-content: space-between;
  justify-content: center;
  place-content: space-between center;
}
```

## Usage

Add [PostCSS Place Properties] to your build tool:

```bash
npm install postcss-place --save-dev
```

#### Node

Use [PostCSS Place Properties] to process your CSS:

```js
import postcssPlace from 'postcss-place';

postcssPlace.process(YOUR_CSS, /* processOptions */, /* pluginOptions */);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Place Properties] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssPlace from 'postcss-place';

postcss([
  postcssPlace(/* pluginOptions */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Place Properties] in your Webpack configuration:

```js
import postcssPlace from 'postcss-place';

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
              postcssPlace(/* pluginOptions */)
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

Use [PostCSS Place Properties] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssPlace from 'postcss-place';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssPlace(/* pluginOptions */)
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

Use [PostCSS Place Properties] in your Gruntfile:

```js
import postcssPlace from 'postcss-place';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssPlace(/* pluginOptions */)
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

The `preserve` option determines whether the original place declaration is
preserved. By default, it is preserved.

```js
postcssPlace({ preserve: false })
```

```pcss
.example {
  place-self: center;
  place-content: space-between center;
}

/* becomes */

.example {
  align-self: center;
  justify-self: center;
  align-content: space-between;
  justify-content: center;
}
```

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-place.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-place
[css-img]: https://cssdb.org/badge/place-properties.svg
[css-url]: https://cssdb.org/#place-properties
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-place.svg
[npm-url]: https://www.npmjs.com/package/postcss-place
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-place.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-place

[CSS Box Alignment]: https://www.w3.org/TR/css-align-3/#place-content
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Place Properties]: https://github.com/jonathantneal/postcss-place
