# Installing PostCSS Custom Media

[PostCSS Custom Media] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Custom Media] to your project:

```bash
npm install postcss-custom-media --save-dev
```

Use [PostCSS Custom Media] to process your CSS:

```js
const postcssCustomMedia = require('postcss-custom-media');

postcssCustomMedia.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomMedia = require('postcss-custom-media');

postcss([
  postcssCustomMedia(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Custom Media] in your `postcss.config.js` configuration file:

```js
const postcssCustomMedia = require('postcss-custom-media');

module.exports = {
  plugins: [
    postcssCustomMedia(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Custom Media] in your Webpack configuration:

```js
const postcssCustomMedia = require('postcss-custom-media');

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
              postcssCustomMedia(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Custom Media] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssCustomMedia = require('postcss-custom-media');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssCustomMedia(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Custom Media] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssCustomMedia = require('postcss-custom-media');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssCustomMedia(/* pluginOptions */)
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

Use [PostCSS Custom Media] in your Gruntfile:

```js
const postcssCustomMedia = require('postcss-custom-media');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssCustomMedia(/* pluginOptions */)
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
[PostCSS Custom Media]: https://github.com/postcss/postcss-custom-media
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
