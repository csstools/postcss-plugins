# Installing PostCSS Color Functional Notation

[PostCSS Color Functional Notation] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Color Functional Notation] to your project:

```bash
npm install postcss-color-functional-notation --save-dev
```

Use [PostCSS Color Functional Notation] to process your CSS:

```js
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

postcssColorFunctionalNotation.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

postcss([
  postcssColorFunctionalNotation(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Color Functional Notation] in your `postcss.config.js` configuration file:

```js
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

module.exports = {
  plugins: [
    postcssColorFunctionalNotation(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Color Functional Notation] in your Webpack configuration:

```js
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

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
              postcssColorFunctionalNotation(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Color Functional Notation] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssColorFunctionalNotation(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Color Functional Notation] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssColorFunctionalNotation(/* pluginOptions */)
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

Use [PostCSS Color Functional Notation] in your Gruntfile:

```js
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssColorFunctionalNotation(/* pluginOptions */)
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
[PostCSS Color Functional Notation]: https://github.com/csstools/postcss-plugins/postcss-color-functional-notation
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
