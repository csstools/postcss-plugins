# Installing PostCSS OKLab Function

[PostCSS OKLab Function] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS OKLab Function] to your project:

```bash
npm install postcss @csstools/postcss-oklab-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

postcss([
  postcssOKLabFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-oklab-function  --save-dev
```

Use [PostCSS OKLab Function] in your `postcss.config.js` configuration file:

```js
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

module.exports = {
  plugins: [
    postcssOKLabFunction(/* pluginOptions */)
  ]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your Webpack configuration:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "@csstools/postcss-oklab-function",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-oklab-function --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS OKLab Function] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssOKLabFunction(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

gulp.task('css', function () {
  var plugins = [
    postcssOKLabFunction(/* pluginOptions */)
  ];

  return gulp.src('./src/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your Gruntfile:

```js
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      processors: [
       postcssOKLabFunction(/* pluginOptions */)
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
[PostCSS OKLab Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-oklab-function
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
