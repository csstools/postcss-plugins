# Installing PostCSS Browser Comments

[PostCSS Browser Comments] runs in all Node environments, with special instructions for:

| [Node](#node) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- |

## Node

Add [PostCSS Browser Comments] to your project:

```bash
npm install postcss-browser-comments --save-dev
```

Use [PostCSS Browser Comments] to process your CSS:

```js
import postcssBrowserComments from 'postcss-browser-comments';

postcssBrowserComments.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
import postcss from 'postcss';
import postcssBrowserComments from 'postcss-browser-comments';

postcss([
  postcssBrowserComments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Browser Comments] in your Webpack configuration:

```js
import postcssBrowserComments from 'postcss-browser-comments';

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
import reactAppRewirePostcss from 'react-app-rewire-postcss';
import postcssBrowserComments from 'postcss-browser-comments';

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
import postcss from 'gulp-postcss';
import postcssBrowserComments from 'postcss-browser-comments';

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
import postcssBrowserComments from 'postcss-browser-comments';

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
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Browser Comments]: https://github.com/csstools/postcss-browser-comments
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
