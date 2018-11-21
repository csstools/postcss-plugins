# Installing PostCSS

[CSS Has Pseudo] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [CSS Has Pseudo] to your project:

```bash
npm install css-has-pseudo --save-dev
```

Use [CSS Has Pseudo] to process your CSS:

```js
const postcssHasPseudo = require('css-has-pseudo/postcss');

postcssHasPseudo.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssHasPseudo = require('css-has-pseudo/postcss');

postcss([
  postcssHasPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [CSS Has Pseudo] in your `postcss.config.js` configuration file:

```js
const postcssHasPseudo = require('css-has-pseudo/postcss');

module.exports = {
  plugins: [
    postcssHasPseudo(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [CSS Has Pseudo] in your Webpack configuration:

```js
const postcssHasPseudo = require('css-has-pseudo/postcss');

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
              postcssHasPseudo(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [CSS Has Pseudo] in your
`config-overrides.js`
file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssHasPseudo = require('css-has-pseudo/postcss');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssHasPseudo(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [CSS Has Pseudo] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssHasPseudo = require('css-has-pseudo/postcss');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssHasPseudo(/* pluginOptions */)
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

Use [CSS Has Pseudo] in your Gruntfile:

```js
const postcssHasPseudo = require('css-has-pseudo/postcss');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssHasPseudo(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[CSS Has Pseudo]: https://github.com/csstools/css-has-pseudo
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
