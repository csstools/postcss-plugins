# Installing PostCSS Double Position Gradients

[PostCSS Double Position Gradients] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Double Position Gradients] to your project:

```bash
npm install postcss-double-position-gradients --save-dev
```

Use [PostCSS Double Position Gradients] to process your CSS:

```js
const postcssDoublePositionGradients = require('postcss-double-position-gradients');

postcssDoublePositionGradients.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssDoublePositionGradients = require('postcss-double-position-gradients');

postcss([
  postcssDoublePositionGradients(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Double Position Gradients] in your `postcss.config.js` configuration file:

```js
const postcssDoublePositionGradients = require('postcss-double-position-gradients');

module.exports = {
  plugins: [
    postcssDoublePositionGradients(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Double Position Gradients] in your Webpack configuration:

```js
const postcssDoublePositionGradients = require('postcss-double-position-gradients');

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
              postcssDoublePositionGradients(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Double Position Gradients] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssDoublePositionGradients = require('postcss-double-position-gradients');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssDoublePositionGradients(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Double Position Gradients] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssDoublePositionGradients = require('postcss-double-position-gradients');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssDoublePositionGradients(/* pluginOptions */)
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

Use [PostCSS Double Position Gradients] in your Gruntfile:

```js
const postcssDoublePositionGradients = require('postcss-double-position-gradients');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssDoublePositionGradients(/* pluginOptions */)
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
[PostCSS Double Position Gradients]: https://github.com/csstools/postcss-double-position-gradients
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
