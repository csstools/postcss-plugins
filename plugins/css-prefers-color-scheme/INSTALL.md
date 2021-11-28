# Installing Prefers Color Scheme

[Prefers Color Scheme] runs in all Node environments, with special
instructions for:

| [Node](#node) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- |

## Node

Add [Prefers Color Scheme] to your project:

```bash
npm install css-prefers-color-scheme
```

Use [Prefers Color Scheme] to process your CSS:

```js
const postcssPrefers = require('css-prefers-color-scheme/postcss');

prefersColorScheme.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPrefers = require('css-prefers-color-scheme/postcss');

postcss([
  prefersColorScheme(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [Prefers Color Scheme] in your Webpack configuration:

```js
const postcssPrefers = require('css-prefers-color-scheme/postcss');

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
              prefersColorScheme(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [Prefers Color Scheme] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssPrefers = require('css-prefers-color-scheme/postcss');

export default config => reactAppRewirePostcss(config, {
  plugins: () => [
    prefersColorScheme(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [Prefers Color Scheme] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssPrefers = require('css-prefers-color-scheme/postcss');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    prefersColorScheme(/* pluginOptions */)
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

Use [Prefers Color Scheme] in your Gruntfile:

```js
const postcssPrefers = require('css-prefers-color-scheme/postcss');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       prefersColorScheme(/* pluginOptions */)
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
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Prefers Color Scheme]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-prefers-color-scheme
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
