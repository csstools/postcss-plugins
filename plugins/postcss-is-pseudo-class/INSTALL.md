# Installing PostCSS Is Pseudo

[PostCSS Is Pseudo Class] runs in all Node environments, with special
instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Is Pseudo Class] to your project:

```bash
npm install postcss @csstools/postcss-is-pseudo-class --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssIsPseudoClass = require('@csstools/postcss-is-pseudo-class');

postcss([
  postcssIsPseudoClass(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Is Pseudo Class] in your `postcss.config.js` configuration
file:

```js
const postcssIsPseudoClass = require('@csstools/postcss-is-pseudo-class');

module.exports = {
  plugins: [
    postcssIsPseudoClass(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Is Pseudo Class] in your Webpack configuration:

```js
const postcssIsPseudoClass = require('@csstools/postcss-is-pseudo-class');

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
              postcssIsPseudoClass(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Is Pseudo Class] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssIsPseudoClass = require('@csstools/postcss-is-pseudo-class');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssIsPseudoClass(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Is Pseudo Class] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssIsPseudoClass = require('@csstools/postcss-is-pseudo-class');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssIsPseudoClass(/* pluginOptions */)
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

Use [PostCSS Is Pseudo Class] in your Gruntfile:

```js
const postcssIsPseudoClass = require('@csstools/postcss-is-pseudo-class');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssIsPseudoClass(/* pluginOptions */)
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
[PostCSS Is Pseudo Class]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-is-pseudo-class
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
