# Installing PostCSS Custom Properties

[PostCSS Custom Properties] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Custom Properties] to your project:

```bash
npm install postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomProperties = require('postcss-custom-properties');

postcss([
  postcssCustomProperties(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Custom Properties] in your `postcss.config.js` configuration file:

```js
const postcssCustomProperties = require('postcss-custom-properties');

module.exports = {
  plugins: [
    postcssCustomProperties(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Custom Properties] in your Webpack configuration:

```js
const postcssCustomProperties = require('postcss-custom-properties');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            postcssOptions: {
                plugins: [postcssCustomProperties(/* pluginOptions */)],
              }
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

Use [React App Rewire PostCSS] and [PostCSS Custom Properties] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssCustomProperties = require('postcss-custom-properties');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssCustomProperties(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Custom Properties] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssCustomProperties(/* pluginOptions */)
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

Use [PostCSS Custom Properties] in your Gruntfile:

```js
const postcssCustomProperties = require('postcss-custom-properties');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      processors: [
       postcssCustomProperties(/* pluginOptions */)
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
[PostCSS Custom Properties]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-properties
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
