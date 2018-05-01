# PostCSS Gap Properties [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS Gap Properties] lets you use the `gap`, `column-gap`, and `row-gap`
shorthand properties in CSS.

```pcss
.standard-grid {
	gap: 20px;
}

.spaced-grid {
	column-gap: 40px;
	row-gap: 20px;
}

/* becomes */

.standard-grid {
	grid-gap: 20px;
	gap: 20px;
}

.spaced-grid {
	grid-column-gap: 40px;
	column-gap: 40px;
	grid-row-gap: 20px;
	row-gap: 20px;
}
```

## Usage

Add [PostCSS Gap Properties] to your build tool:

```bash
npm install postcss-gap-properties --save-dev
```

#### Node

Use [PostCSS Gap Properties] to process your CSS:

```js
import postcssGapProperties from 'postcss-gap-properties';

postcssGapProperties.process(YOUR_CSS, /* processOptions */, /* pluginOptions */);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Gap Properties] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssGapProperties from 'postcss-gap-properties';

postcss([
  postcssGapProperties(/* pluginOptions */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Gap Properties] in your Webpack configuration:

```js
import postcssGapProperties from 'postcss-gap-properties';

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
              postcssGapProperties(/* pluginOptions */)
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

Use [PostCSS Gap Properties] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssGapProperties from 'postcss-gap-properties';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssGapProperties(/* pluginOptions */)
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

Use [PostCSS Gap Properties] in your Gruntfile:

```js
import postcssGapProperties from 'postcss-gap-properties';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssGapProperties(/* pluginOptions */)
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

The `preserve` option determines whether the original `gap` declaration should
remain in the CSS. By default, the original declaration is preserved.

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-gap-properties.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-gap-properties
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-gap-properties.svg
[npm-url]: https://www.npmjs.com/package/postcss-gap-properties
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-gap-properties.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-gap-properties

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Gap Properties]: https://github.com/jonathantneal/postcss-gap-properties
