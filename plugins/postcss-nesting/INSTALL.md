# Installing PostCSS Nesting

[PostCSS Nesting] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Nesting] to your project:

```bash
npm install postcss-nesting --save-dev
```

Use [PostCSS Nesting] to process your CSS:

```js
import postcssNesting from 'postcss-nesting';

postcssNesting.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
import postcss from 'postcss';
import postcssNesting from 'postcss-nesting';

postcss([
  postcssNesting(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Nesting] in your `postcss.config.js` configuration file:

```js
const postcssNesting = require('postcss-nesting');

module.exports = {
  plugins: [
    postcssNesting(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Nesting] in your Webpack configuration:

```js
import postcssNesting from 'postcss-nesting';

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
              postcssNesting(/* pluginOptions */)
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

Use [React App Rewire PostCSS] and [PostCSS Nesting] in your
`config-overrides.js` file:

```js
import reactAppRewirePostcss from 'react-app-rewire-postcss';
import postcssNesting from 'postcss-nesting';

export default config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssNesting(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Nesting] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssNesting from 'postcss-nesting';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssNesting(/* pluginOptions */)
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

Use [PostCSS Nesting] in your Gruntfile:

```js
import postcssNesting from 'postcss-nesting';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssNesting(/* pluginOptions */)
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
[PostCSS Nesting]: https://github.com/jonathantneal/postcss-nesting
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
