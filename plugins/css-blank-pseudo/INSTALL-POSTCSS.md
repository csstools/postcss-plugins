# Installing PostCSS

[CSS Blank Pseudo] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [CSS Blank Pseudo] to your project:

```bash
npm install css-blank-pseudo --save-dev
```

Use [CSS Blank Pseudo] to process your CSS:

```js
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

postcssBlankPseudo.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

postcss([
  postcssBlankPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [CSS Blank Pseudo] in your `postcss.config.js` configuration file:

```js
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

module.exports = {
  plugins: [
    postcssBlankPseudo(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [CSS Blank Pseudo] in your Webpack configuration:

```js
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

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
              postcssBlankPseudo(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [CSS Blank Pseudo] in your
`config-overrides.js`
file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssBlankPseudo(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [CSS Blank Pseudo] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssBlankPseudo(/* pluginOptions */)
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

Use [CSS Blank Pseudo] in your Gruntfile:

```js
const postcssBlankPseudo = require('css-blank-pseudo/postcss');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssBlankPseudo(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[CSS Blank Pseudo]: https://github.com/csstools/css-blank-pseudo
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
