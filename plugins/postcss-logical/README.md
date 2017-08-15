# PostCSS Logical Properties [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Logical Properties] lets you use nearly 60 new [logical properties]
and a half dozen flow-relative values in CSS.

```css
.banner {
  color: #222222;
  inset: logical 0 5px 10px;
  padding-inline: 20px 40px;
  resize: block;
}

/* used alongside postcss-nesting, postcss-dir-pseudo-class */

.banner {
  color: #222222;
  top: 0; left: 5px; bottom: 10px; right: 5px;
}

[dir="ltr"] .banner {
  padding-left: 20px; padding-right: 40px;
}

[dir="rtl"] .banner {
  padding-right: 20px; padding-left: 40px;
}

.banner {
  resize: vertical;
}
```

These shorthand properties set values for physical properties by default.
Specifying the `logical` keyboard at the beginning of the property value will
transform the flow-relative values afterward into both physical LTR and RTL
properties:

#### Logical Borders

- `border`, `border-block`, `border-block-start`, `border-block-end`,
  `border-inline`, `border-inline-start`, `border-inline-end`, `border-start`,
  `border-end`, `border-color`, `border-block-color`,
  `border-block-start-color`, `border-block-end-color`, `border-inline-color`,
  `border-inline-start-color`, `border-inline-end-color`, `border-start-color`,
  `border-end-color`, `border-style`, `border-block-style`,
  `border-block-start-style`, `border-block-end-style`, `border-inline-style`,
  `border-inline-start-style`, `border-inline-end-style`, `border-start-style`,
  `border-end-style`, `border-width`, `border-block-width`,
  `border-block-start-width`, `border-block-end-width`, `border-inline-width`,
  `border-inline-start-width`, `border-inline-end-width`, `border-start-width`,
  `border-end-width`

#### Logical Offsets

- `inset`, `inset-block`, `inset-block-start`, `inset-block-end`,
  `inset-inline`, `inset-inline-start`, `inset-inline-end`, `inset-start`,
  `inset-end`

#### Logical Margins

- `margin`, `margin-block`, `margin-block-start`, `margin-block-end`,
  `margin-inline`, `margin-inline-start`, `margin-inline-end`, `margin-start`,
  `margin-end`

#### Logical Paddings

- `padding`, `padding-block`, `padding-block-start`, `padding-block-end`,
  `padding-inline`, `padding-inline-start`, `padding-inline-end`,
  `padding-start`, `padding-end`

#### Logical Sizes

- `block-size`, `inline-size`

#### Flow-Relative Values

- `clear: inline-start`, `clear: inline-end`, `float: inline-start`,
  `float: inline-end`, `text-align: start`, `text-align: end`

---

[PostCSS Logical Properties] changes the selector weight of flow-relative
declarations and requires at least one [dir] attribute in your HTML. If you
don’t have any [dir] attributes, consider using the following JavaScript:

```js
// force at least one dir attribute (this can run at any time)
document.documentElement.dir=document.documentElement.dir||'ltr';
```

## Usage

Add [PostCSS Logical Properties] to your build tool:

```bash
npm install postcss-logical --save-dev
```

#### Node

Use [PostCSS Logical Properties] to process your CSS:

```js
require('postcss-logical').process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Logical Properties] as a plugin:

```js
postcss([
  require('postcss-logical')()
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Logical Properties] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-logical')()
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

Use [PostCSS Logical Properties] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-logical')()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[npm-url]: https://www.npmjs.com/package/postcss-logical
[npm-img]: https://img.shields.io/npm/v/postcss-logical.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-logical-properties
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-logical-properties.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-logical-properties
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-logical-properties.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS Logical Properties]: https://github.com/jonathantneal/postcss-logical-properties
[logical properties]: https://drafts.csswg.org/css-logical/
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
