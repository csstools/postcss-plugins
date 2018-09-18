# Installing PostCSS Color Hex Alpha

[PostCSS Color Hex Alpha] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Color Hex Alpha] to your project:

```bash
npm install postcss-color-hex-alpha --save-dev
```

Use [PostCSS Color Hex Alpha] to process your CSS:

```js
const postcssColorHexAlpha = require('postcss-color-hex-alpha');

postcssColorHexAlpha.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssColorHexAlpha = require('postcss-color-hex-alpha');

postcss([
  postcssColorHexAlpha(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Color Hex Alpha] in your `postcss.config.js` configuration file:

```js
const postcssColorHexAlpha = require('postcss-color-hex-alpha');

module.exports = {
  plugins: [
    postcssColorHexAlpha(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Color Hex Alpha] in your Webpack configuration:

```js
const postcssColorHexAlpha = require('postcss-color-hex-alpha');

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
              postcssColorHexAlpha(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Color Hex Alpha] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssColorHexAlpha = require('postcss-color-hex-alpha');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssColorHexAlpha(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Color Hex Alpha] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssColorHexAlpha = require('postcss-color-hex-alpha');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssColorHexAlpha(/* pluginOptions */)
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

Use [PostCSS Color Hex Alpha] in your Gruntfile:

```js
const postcssColorHexAlpha = require('postcss-color-hex-alpha');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssColorHexAlpha(/* pluginOptions */)
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
[PostCSS Color Hex Alpha]: https://github.com/postcss/postcss-color-hex-alpha
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
