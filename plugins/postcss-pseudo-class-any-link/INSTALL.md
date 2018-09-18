# Installing PostCSS

[PostCSS Pseudo Class Any Link] runs in all Node environments, with special
instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Pseudo Class Any Link] to your project:

```bash
npm install postcss-pseudo-class-any-link --save-dev
```

Use [PostCSS Pseudo Class Any Link] to process your CSS:

```js
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

postcssPseudoClassAnyLink.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

postcss([
  postcssPseudoClassAnyLink(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your `postcss.config.js` configuration
file:

```js
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

module.exports = {
  plugins: [
    postcssPseudoClassAnyLink(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your Webpack configuration:

```js
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

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
              postcssPseudoClassAnyLink(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Pseudo Class Any Link] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssPseudoClassAnyLink(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssPseudoClassAnyLink(/* pluginOptions */)
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

Use [PostCSS Pseudo Class Any Link] in your Gruntfile:

```js
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssPseudoClassAnyLink(/* pluginOptions */)
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
[PostCSS Pseudo Class Any Link]: https://github.com/jonathantneal/postcss-pseudo-class-any-link
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
