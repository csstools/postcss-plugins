# Installing PostCSS color-mod() Function

[PostCSS color-mod() Function] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS color-mod() Function] to your project:

```bash
npm install postcss-color-mod-function --save-dev
```

Use [PostCSS color-mod() Function] to process your CSS:

```js
const postcssColorMod = require('postcss-color-mod-function');

postcssColorMod.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssColorMod = require('postcss-color-mod-function');

postcss([
  postcssColorMod(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS color-mod() Function] in your `postcss.config.js` configuration file:

```js
const postcssColorMod = require('postcss-color-mod-function');

module.exports = {
  plugins: [
    postcssColorMod(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS color-mod() Function] in your Webpack configuration:

```js
const postcssColorMod = require('postcss-color-mod-function');

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
              postcssColorMod(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS color-mod() Function] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssColorMod = require('postcss-color-mod-function');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssColorMod(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS color-mod() Function] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssColorMod = require('postcss-color-mod-function');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssColorMod(/* pluginOptions */)
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

Use [PostCSS color-mod() Function] in your Gruntfile:

```js
const postcssColorMod = require('postcss-color-mod-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssColorMod(/* pluginOptions */)
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
[PostCSS color-mod() Function]: https://github.com/jonathantneal/postcss-color-mod-function
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
