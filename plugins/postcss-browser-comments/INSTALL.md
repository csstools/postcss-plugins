# Installing PostCSS Browser Comments

[PostCSS Browser Comments] runs in all Node environments, with special
instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Browser Comments] to your project:

```bash
npm install postcss-browser-comments --save-dev
```

Use [PostCSS Browser Comments] to process your CSS:

```js
const postcssBrowserComments = require('postcss-browser-comments');

postcssBrowserComments.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBrowserComments = require('postcss-browser-comments');

postcss([
  postcssBrowserComments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Browser Comments] in your `postcss.config.js` configuration file:

```js
const postcssBrowserComments = require('postcss-browser-comments');

module.exports = {
  plugins: [
    postcssBrowserComments(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Browser Comments] in your Webpack configuration:

```js
const postcssBrowserComments = require('postcss-browser-comments');

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
              postcssBrowserComments(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Browser Comments] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssBrowserComments = require('postcss-browser-comments');

export default config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssBrowserComments(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Browser Comments] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssBrowserComments = require('postcss-browser-comments');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssBrowserComments(/* pluginOptions */)
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

Use [PostCSS Browser Comments] in your Gruntfile:

```js
const postcssBrowserComments = require('postcss-browser-comments');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssBrowserComments(/* pluginOptions */)
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
[PostCSS Browser Comments]: https://github.com/csstools/postcss-browser-comments
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
