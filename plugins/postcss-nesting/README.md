# PostCSS Nesting [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![CSS Standard Status][css-img]][css-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-img]][lic-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Nesting] lets you nest style rules inside each other, following the
[CSS Nesting] specification.

```css
a, b {
  color: red;

  & c, & d {
    color: white;
  }
}

/* after postcss-nesting */

a, b {
  color: red;
}

a c, a d, b c, b d {
  color: white;
}
```

## Usage

Add [PostCSS Nesting] to your build tool:

```bash
npm install postcss-nesting --save-dev
```

#### Node

Use [PostCSS Nesting] to process your CSS:

```js
require('postcss-nesting').process(YOUR_CSS, { /* options */ });
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Nesting] as a plugin:

```js
postcss([
  require('postcss-nesting')({ /* options */ })
]).process(YOUR_CSS, /* options */);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Nesting] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-nesting')({ /* options */ })
    ])
  ).pipe(
    gulp.dest('.')
  );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS Nesting] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-nesting')({ /* options */ })
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[cli-url]: https://travis-ci.org/jonathantneal/postcss-nesting
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-nesting.svg
[css-img]: https://jonathantneal.github.io/css-db/badge/css-nesting.svg
[css-url]: https://jonathantneal.github.io/css-db/#css-nesting
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg
[lic-url]: LICENSE.md
[lic-img]: https://img.shields.io/npm/l/postcss-nesting.svg
[npm-url]: https://www.npmjs.com/package/postcss-nesting
[npm-img]: https://img.shields.io/npm/v/postcss-nesting.svg

[CSS Nesting]: http://tabatkins.github.io/specs/css-nesting/
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Nesting]: https://github.com/jonathantneal/postcss-nesting
