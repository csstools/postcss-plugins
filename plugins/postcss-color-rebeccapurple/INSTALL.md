# Installing PostCSS RebeccaPurple

[PostCSS RebeccaPurple] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS RebeccaPurple] to your project:

```bash
npm install postcss-color-rebeccapurple --save-dev
```

Use **PostCSS RebeccaPurple** as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssRebeccapurple = require('postcss-color-rebeccapurple');

postcss([
  postcssRebeccapurple(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use **PostCSS RebeccaPurple** in your `postcss.config.js` configuration file:

```js
const postcssRebeccapurple = require('postcss-color-rebeccapurple');

module.exports = {
  plugins: [
    postcssRebeccapurple(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use **PostCSS RebeccaPurple** in your Webpack configuration:

```js
const postcssRebeccapurple = require('postcss-color-rebeccapurple');

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
              postcssRebeccapurple(/* pluginOptions */)
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

Use **React App Rewire PostCSS** and **PostCSS RebeccaPurple** in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssRebeccapurple = require('postcss-color-rebeccapurple');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssRebeccapurple(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use **PostCSS RebeccaPurple** in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssRebeccapurple = require('postcss-color-rebeccapurple');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssRebeccapurple(/* pluginOptions */)
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

Use **PostCSS RebeccaPurple** in your Gruntfile:

```js
const postcssRebeccapurple = require('postcss-color-rebeccapurple');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssRebeccapurple(/* pluginOptions */)
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
[PostCSS RebeccaPurple]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-rebeccapurple
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
