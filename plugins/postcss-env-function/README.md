# PostCSS Environment Variables [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS Environment Variables] lets you use `env()` variables in CSS,
following the [CSS Environment Variables] specification.

```pcss
@media (max-width: env(--branding-small)) {
  body {
    padding: env(--branding-padding);
  }
}

/* becomes */

@media (min-width: 600px) {
  body {
    padding: 20px;
  }
}

/* when the `variables` option is: {
  "--branding-small": "600px",
  "--branding-padding": "20px"
} */
```

## Usage

Add [PostCSS Environment Variables] to your build tool:

```bash
npm install postcss-env-function --save-dev
```

#### Node

Use [PostCSS Environment Variables] to process your CSS:

```js
import postcssEnvFunction from 'postcss-env-function';

postcssEnvFunction.process(YOUR_CSS, /* processOptions */, /* pluginOptions */);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Environment Variables] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssEnvFunction from 'postcss-env-function';

postcss([
  postcssEnvFunction(/* pluginOptions */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Environment Variables] in your Webpack configuration:

```js
import postcssEnvFunction from 'postcss-env-function';

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
              postcssEnvFunction(/* pluginOptions */)
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

Use [PostCSS Environment Variables] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssEnvFunction from 'postcss-env-function';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssEnvFunction(/* pluginOptions */)
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

Use [PostCSS Environment Variables] in your Gruntfile:

```js
import postcssEnvFunction from 'postcss-env-function';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssEnvFunction(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-env-function.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-env-function
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-env-function.svg
[npm-url]: https://www.npmjs.com/package/postcss-env-function
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-env-function.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-env-function

[CSS Environment Variables]: https://drafts.csswg.org/css-env-1/
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Environment Variables]: https://github.com/jonathantneal/postcss-env-function
[PostCSS Loader]: https://github.com/postcss/postcss-loader
