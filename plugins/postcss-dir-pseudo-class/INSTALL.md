# Installing PostCSS Dir Pseudo Class

[PostCSS Dir Pseudo Class] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Dir Pseudo Class] to your project:

```bash
npm install postcss-dir-pseudo-class --save-dev
```

Use [PostCSS Dir Pseudo Class] to process your CSS:

```js
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');

postcssDirPseudoClass.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');

postcss([
  postcssDirPseudoClass(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Dir Pseudo Class] in your `postcss.config.js` configuration file:

```js
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');

module.exports = {
  plugins: [
    postcssDirPseudoClass(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Dir Pseudo Class] in your Webpack configuration:

```js
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');

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
              postcssDirPseudoClass(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Dir Pseudo Class] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssDirPseudoClass(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Dir Pseudo Class] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssDirPseudoClass(/* pluginOptions */)
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

Use [PostCSS Dir Pseudo Class] in your Gruntfile:

```js
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssDirPseudoClass(/* pluginOptions */)
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
[PostCSS Dir Pseudo Class]: https://github.com/jonathantneal/postcss-dir-pseudo-class
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
