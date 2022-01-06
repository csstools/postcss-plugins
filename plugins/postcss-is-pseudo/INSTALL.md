# Installing PostCSS Is Pseudo

[PostCSS Is Pseudo] runs in all Node environments, with special
instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Is Pseudo] to your project:

```bash
npm install postcss @csstools/postcss-is-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssIsPseudo = require('@csstools/postcss-is-pseudo');

postcss([
  postcssIsPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Is Pseudo] in your `postcss.config.js` configuration
file:

```js
const postcssIsPseudo = require('@csstools/postcss-is-pseudo');

module.exports = {
  plugins: [
    postcssIsPseudo(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Is Pseudo] in your Webpack configuration:

```js
const postcssIsPseudo = require('@csstools/postcss-is-pseudo');

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
              postcssIsPseudo(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Is Pseudo] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssIsPseudo = require('@csstools/postcss-is-pseudo');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssIsPseudo(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Is Pseudo] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssIsPseudo = require('@csstools/postcss-is-pseudo');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssIsPseudo(/* pluginOptions */)
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

Use [PostCSS Is Pseudo] in your Gruntfile:

```js
const postcssIsPseudo = require('@csstools/postcss-is-pseudo');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssIsPseudo(/* pluginOptions */)
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
[PostCSS Is Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-is-pseudo
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
