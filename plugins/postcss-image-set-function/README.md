# PostCSS image-set() Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS image-set() Function] lets you display resolution-dependent images
using the `image-set()` function in CSS, following the [CSS Images]
specification.

```pcss
.example {
  background-image: image-set(
    url(img.png) 1x,
    url(img@2x.png) 2x,
    url(img@print.png) 600dpi
  );
}

/* becomes */

@media (-webkit-min-device-pixel-ratio: 1), (min-resolution: 96dpi) {
  .example {
    background-image: url(img.png);
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .example {
    background-image: url(img@2x.png);
  }
}


@media (-webkit-min-device-pixel-ratio: 6.25), (min-resolution: 600dpi) {
  .example {
    background-image: url(my@print.png);
  }
}

.example {
  background-image: image-set(
    url(img.png) 1x,
    url(img@2x.png) 2x,
    url(img@print.png) 600dpi
  );
}
```

## Usage

Add [PostCSS image-set() Function] to your build tool:

```bash
npm install postcss-image-set-function --save-dev
```

#### Node

Use [PostCSS image-set() Function] to process your CSS:

```js
import postcssImageSetFunction from 'postcss-image-set-function';

postcssImageSetFunction.process(YOUR_CSS, /* processOptions */, /* pluginOptions */);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS image-set() Function] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssImageSetFunction from 'postcss-image-set-function';

postcss([
  postcssImageSetFunction(/* pluginOptions */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS image-set() Function] in your Webpack configuration:

```js
import postcssImageSetFunction from 'postcss-image-set-function';

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
              postcssImageSetFunction(/* pluginOptions */)
            ]
          } }
        ]
      }
    ]
  }
}
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS image-set() Function] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssImageSetFunction from 'postcss-image-set-function';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssImageSetFunction(/* pluginOptions */)
  ])
).pipe(
  gulp.dest('.')
));
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS image-set() Function] in your Gruntfile:

```js
import postcssImageSetFunction from 'postcss-image-set-function';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssImageSetFunction(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### preserve

The `preserve` option determines whether the original declaration using
`image-set()` is preserved. By default, it is preserved.

```js
postcssImageSetFunction({ preserve: false })
```

```pcss
.example {
  background-image: image-set(
    url(img.png) 1x,
    url(img@2x.png) 2x,
    url(img@print.png) 600dpi
  );
}

/* becomes */

@media (-webkit-min-device-pixel-ratio: 1), (min-resolution: 96dpi) {
  .example {
    background-image: url(img.png);
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .example {
    background-image: url(img@2x.png);
  }
}


@media (-webkit-min-device-pixel-ratio: 6.25), (min-resolution: 600dpi) {
  .example {
    background-image: url(my@print.png);
  }
}
```

### onvalid

The `oninvalid` option determines how invalid usage of `image-set()` should be
handled. By default, invalid usages of `image-set()` are ignored. They can be
configured to display a `warning` or `throw` an error.

```js
postcssImageSetFunction({ oninvalid: 'warning' }) // warn on invalid usages
```

```js
postcssImageSetFunction({ oninvalid: 'throw' }) // throw on invalid usages
```

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-image-set-function.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-image-set-function
[css-img]: https://cssdb.org/badge/image-set-function.svg
[css-url]: https://cssdb.org/#image-set-function
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-image-set-function.svg
[npm-url]: https://www.npmjs.com/package/postcss-image-set-function
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-image-set-function.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-image-set-function

[CSS Images]: https://drafts.csswg.org/css-images-4/#image-set-notation
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS image-set() Function]: https://github.com/jonathantneal/postcss-image-set-function
