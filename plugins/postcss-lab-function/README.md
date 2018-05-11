# PostCSS Lab Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS Lab Function] lets you use `lab` and `lch` color functions in CSS,
following the [CSS Color] specification.

```pcss
:root {
  --firebrick: lab(40 56.6 39);
  --firebrick-a50: lch(40 68.8 34.5 / 50%);
}

/* becomes */

:root {
  --firebrick: rgb(178, 34, 34);
  --firebrick-a50: rgba(178, 34, 34, .5);
}
```

## Usage

Add [PostCSS Lab Function] to your build tool:

```bash
npm install postcss-lab-function --save-dev
```

#### Node

Use [PostCSS Lab Function] to process your CSS:

```js
import postcssLabFunction from 'postcss-lab-function';

postcssLabFunction.process(YOUR_CSS, /* processOptions */, /* pluginOptions */);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Lab Function] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssLabFunction from 'postcss-lab-function';

postcss([
  postcssLabFunction(/* pluginOptions */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Lab Function] in your Webpack configuration:

```js
import postcssLabFunction from 'postcss-lab-function';

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
              postcssLabFunction(/* pluginOptions */)
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

Use [PostCSS Lab Function] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssLabFunction from 'postcss-lab-function';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssLabFunction(/* pluginOptions */)
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

Use [PostCSS Lab Function] in your Gruntfile:

```js
import postcssLabFunction from 'postcss-lab-function';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssLabFunction(/* pluginOptions */)
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

The `preserve` option determines whether the original functional color notation
is preserved. By default, it is not preserved.

```js
postcssImageSetFunction({ preserve: true })
```

```pcss
:root {
  --firebrick: lab(40 56.6 39);
  --firebrick-a50: lch(40 68.8 34.5 / 50%);
}

/* becomes */

:root {
  --firebrick: rgb(178, 34, 34);
  --firebrick: lab(40 56.6 39);
  --firebrick-a50: rgba(178, 34, 34, .5);
  --firebrick-a50: lch(40 68.8 34.5 / 50%);
}
```

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-lab-function.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-lab-function
[css-img]: https://cssdb.org/badge/lab-function.svg
[css-url]: https://cssdb.org/#lab-function
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-lab-function.svg
[npm-url]: https://www.npmjs.com/package/postcss-lab-function
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-lab-function.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-lab-function

[CSS Color]: https://drafts.csswg.org/css-color/#specifying-lab-lch
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Lab Function]: https://github.com/jonathantneal/postcss-lab-function
