# Installing PostCSS

[PostCSS Overflow Shorthand] runs in all Node environments, with special
instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Overflow Shorthand] to your project:

```bash
npm install postcss postcss-overflow-shorthand --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

postcss([
  postcssOverflowShorthand(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Overflow Shorthand] in your `postcss.config.js` configuration
file:

```js
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

module.exports = {
  plugins: [
    postcssOverflowShorthand(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Overflow Shorthand] in your Webpack configuration:

```js
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

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
              postcssOverflowShorthand(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Overflow Shorthand] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssOverflowShorthand(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Overflow Shorthand] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssOverflowShorthand(/* pluginOptions */)
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

Use [PostCSS Overflow Shorthand] in your Gruntfile:

```js
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssOverflowShorthand(/* pluginOptions */)
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
[PostCSS Overflow Shorthand]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-overflow-shorthand
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
