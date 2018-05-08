# PostCSS Overflow Shorthand [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS Overflow Shorthand] lets you use the `overflow` shorthand in CSS,
following the [CSS Overflow] specification.

```pcss
html {
  overflow: hidden auto;
}

/* becomes */

html {
  overflow-x: hidden;
  overflow-y: auto;
  overflow: hidden auto;
}
```

## Usage

Add [PostCSS Overflow Shorthand] to your build tool:

```bash
npm install postcss-overflow-shorthand --save-dev
```

#### Node

Use [PostCSS Overflow Shorthand] to process your CSS:

```js
import postcssOverflowShorthand from 'postcss-overflow-shorthand';

postcssOverflowShorthand.process(YOUR_CSS, /* processOptions */, /* pluginOptions */);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Overflow Shorthand] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssOverflowShorthand from 'postcss-overflow-shorthand';

postcss([
  postcssOverflowShorthand(/* pluginOptions */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Overflow Shorthand] in your Webpack configuration:

```js
import postcssOverflowShorthand from 'postcss-overflow-shorthand';

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
              postcssOverflowShorthand(/* pluginOptions */)
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

Use [PostCSS Overflow Shorthand] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssOverflowShorthand from 'postcss-overflow-shorthand';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssOverflowShorthand(/* pluginOptions */)
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

Use [PostCSS Overflow Shorthand] in your Gruntfile:

```js
import postcssOverflowShorthand from 'postcss-overflow-shorthand';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssOverflowShorthand(/* pluginOptions */)
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

The `preserve` option determines whether the original `overflow` declaration is
preserved. By default, it is preserved.

```js
postcssOverflowShorthand({ preserve: false })
```

```pcss
html {
  overflow: hidden auto;
}

/* becomes */

html {
  overflow-x: hidden;
  overflow-y: auto;
}
```

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-overflow-shorthand.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-overflow-shorthand
[css-img]: https://cssdb.org/badge/overflow-property.svg
[css-url]: https://cssdb.org/#overflow-property
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-overflow-shorthand.svg
[npm-url]: https://www.npmjs.com/package/postcss-overflow-shorthand
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-overflow-shorthand.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-overflow-shorthand

[CSS Overflow]: https://drafts.csswg.org/css-overflow/#propdef-overflow
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Overflow Shorthand]: https://github.com/jonathantneal/postcss-overflow-shorthand
