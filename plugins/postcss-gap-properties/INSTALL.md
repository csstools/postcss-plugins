# Installing PostCSS Gap Properties

[PostCSS Gap Properties] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Gap Properties] to your project:

```bash
npm install postcss-gap-properties --save-dev
```

Use [PostCSS Gap Properties] to process your CSS:

```js
import postcssGapProperties from 'postcss-gap-properties';

postcssGapProperties.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
import postcss from 'postcss';
import postcssGapProperties from 'postcss-gap-properties';

postcss([
  postcssGapProperties(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Gap Properties] in your `postcss.config.js` configuration file:

```js
const postcssGapProperties = require('postcss-gap-properties');

module.exports = {
  plugins: [
    postcssGapProperties(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Gap Properties] in your Webpack configuration:

```js
import postcssGapProperties from 'postcss-gap-properties';

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
              postcssGapProperties(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Gap Properties] in your
`config-overrides.js` file:

```js
import reactAppRewirePostcss from 'react-app-rewire-postcss';
import postcssGapProperties from 'postcss-gap-properties';

export default config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssGapProperties(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Gap Properties] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssGapProperties from 'postcss-gap-properties';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssGapProperties(/* pluginOptions */)
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

Use [PostCSS Gap Properties] in your Gruntfile:

```js
import postcssGapProperties from 'postcss-gap-properties';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssGapProperties(/* pluginOptions */)
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
[PostCSS Gap Properties]: https://github.com/jonathantneal/postcss-gap-properties
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
