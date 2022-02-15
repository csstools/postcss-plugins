# Installing PostCSS IC Unit

[PostCSS IC Unit] runs in all Node environments, with special
instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS IC Unit] to your project:

```bash
npm install postcss @csstools/postcss-ic-unit --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssNormalizeDisplayValues = require('@csstools/postcss-ic-unit');

postcss([
  postcssNormalizeDisplayValues(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS IC Unit] in your `postcss.config.js` configuration
file:

```js
const postcssNormalizeDisplayValues = require('@csstools/postcss-ic-unit');

module.exports = {
  plugins: [
    postcssNormalizeDisplayValues(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS IC Unit] in your Webpack configuration:

```js
const postcssNormalizeDisplayValues = require('@csstools/postcss-ic-unit');

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
              postcssNormalizeDisplayValues(/* pluginOptions */)
            ]
          } }
        ]
      }
    ]
  }
}
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS IC Unit] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssNormalizeDisplayValues = require('@csstools/postcss-ic-unit');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssNormalizeDisplayValues(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS IC Unit] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssNormalizeDisplayValues = require('@csstools/postcss-ic-unit');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssNormalizeDisplayValues(/* pluginOptions */)
  ])
).pipe(
  gulp.dest('.')
));
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS IC Unit] in your Gruntfile:

```js
const postcssNormalizeDisplayValues = require('@csstools/postcss-ic-unit');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssNormalizeDisplayValues(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS IC Unit]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-ic-unit
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
