# PostCSS Nesting [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS Nesting] lets you nest style rules inside each other, following the
[CSS Nesting] specification.

```pcss
a, b {
  color: red;

  & c, & d {
    color: white;
  }
}

/* becomes */

a, b {
  color: red;
}

a c, a d, b c, b d {
  color: white;
}
```

## Usage

Add [PostCSS Nesting] to your build tool:

```bash
npm install postcss-nesting --save-dev
```

#### Node

Use [PostCSS Nesting] to process your CSS:

```js
import postcssNesting from 'postcss-nesting';

postcssNesting.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Nesting] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssNesting from 'postcss-nesting';

postcss([
  postcssNesting(/* options */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Nesting] in your Webpack configuration:

```js
import postcssNesting from 'postcss-nesting';

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
              postcssNesting(/* options */)
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

Use [PostCSS Nesting] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssNesting from 'postcss-nesting';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssNesting(/* options */)
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

Use [PostCSS Nesting] in your Gruntfile:

```js
import postcssNesting from 'postcss-nesting';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssNesting(/* options */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[cli-url]: https://travis-ci.org/jonathantneal/postcss-nesting
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-nesting.svg
[css-img]: https://jonathantneal.github.io/cssdb/badge/nesting-rules.svg
[css-url]: https://jonathantneal.github.io/cssdb/#nesting-rules
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg
[npm-url]: https://www.npmjs.com/package/postcss-nesting
[npm-img]: https://img.shields.io/npm/v/postcss-nesting.svg
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-nesting.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-nesting

[CSS Nesting]: http://tabatkins.github.io/specs/css-nesting/
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Nesting]: https://github.com/jonathantneal/postcss-nesting
