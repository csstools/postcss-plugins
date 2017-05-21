# PostCSS Nesting [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-img]][lic-url]
[![Changelog][log-img]][log-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Nesting] lets you nest style rules inside each other, following the
[CSS Nesting Module Level 3] specification.

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

[npm-url]: https://www.npmjs.com/package/postcss-nesting
[npm-img]: https://img.shields.io/npm/v/postcss-nesting.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-nesting
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-nesting.svg
[lic-url]: LICENSE.md
[lic-img]: https://img.shields.io/npm/l/postcss-nesting.svg
[log-url]: CHANGELOG.md
[log-img]: https://img.shields.io/badge/changelog-md-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS Nesting]: https://github.com/jonathantneal/postcss-nesting
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss

[CSS Nesting Module Level 3]: http://tabatkins.github.io/specs/css-nesting/
