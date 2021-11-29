# Installing PostCSS Place Properties

[PostCSS Place Properties] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Place Properties] to your project:

```bash
npm install postcss postcss-place --save-dev
```

Use it as a [PostCSS] plugin:

```js
import postcss from 'postcss';
import postcssPlace from 'postcss-place';

postcss([
  postcssPlace(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Place Properties] in your `postcss.config.js` configuration file:

```js
const postcssPlace = require('postcss-place');

module.exports = {
  plugins: [
    postcssPlace(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Place Properties] in your Webpack configuration:

```js
import postcssPlace from 'postcss-place';

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
              postcssPlace(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Place Properties] in your
`config-overrides.js` file:

```js
import reactAppRewirePostcss from 'react-app-rewire-postcss';
import postcssPlace from 'postcss-place';

export default config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssPlace(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Place Properties] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssPlace from 'postcss-place';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssPlace(/* pluginOptions */)
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

Use [PostCSS Place Properties] in your Gruntfile:

```js
import postcssPlace from 'postcss-place';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssPlace(/* pluginOptions */)
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
[PostCSS Place Properties]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-place
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
