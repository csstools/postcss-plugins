# PostCSS color-mod() Function [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS color-mod() Function] lets you modify colors using the `color-mod()`
function in CSS, following the [CSS Color Module Level 4] specification.

```css
:root {
  --brand-red:      color-mod(yellow blend(red 50%));
  --brand-red-hsl:  color-mod(yellow blend(red 50% hsl));
  --brand-red-hwb:  color-mod(yellow blend(red 50% hwb));
  --brand-red-dark: color-mod(red blackness(20%));
}

/* becomes */

:root {
  --brand-red:      rgb(255, 127.5, 0);
  --brand-red-hsl:  rgb(255, 127.5, 255);
  --brand-red-hwb:  rgb(255, 127.5, 0);
  --brand-red-dark: rgb(204, 0, 0);
}

/* or, using stringifier(color) { return color.toString() } */

:root {
  --brand-red:      rgb(100% 50% 0% / 100%);
  --brand-red-hsl:  hsl(30 100% 50% / 100%);
  --brand-red-hwb:  hwb(30 0% 0% / 100%);
  --brand-red-dark: hwb(0 0% 20% / 100%);
}
```

## Supported Colors

The `color-mod()` function accepts `rgb()`, legacy comma-separated `rgb()`,
`rgba()`, `hsl()`, legacy comma-separated `hsl()`, `hsla()`, `hwb()`, and
`color-mod()` colors, as well as 3, 4, 6, and 8 digit hex colors, and named
colors without the need for additional plugins.

Implemention details are available in
[the specification](https://drafts.csswg.org/css-color/#funcdef-color-mod).

## Supported Color Adjusters

The `color-mod()` function accepts `red()`, `green()`, `blue()`, `a()` /
`alpha()`, `rgb()`, `h()` / `hue()`, `s()` / `saturation()`, `l()` /
`lightness()`, `w()` / `whiteness()`, `b()` / `blackness()`, `tint()`,
`shade()`, `blend()`, `blenda()`, and `contrast()` color adjusters.

Implemention details are available in
[the specification](https://drafts.csswg.org/css-color/#typedef-color-adjuster).

## Supported Variables

By default, `var()` variables will be used if their corresponding Custom
Properties are found in a `:root` rule, or if a fallback value is specified.

---

## Usage

Add [PostCSS color-mod() Function] to your build tool:

```bash
npm install postcss-color-mod-function --save-dev
```

#### Node

Use [PostCSS color-mod() Function] to process your CSS:

```js
import postcssColorMod from 'postcss-color-mod-function';

postcssColorMod.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS color-mod() Function] as a plugin:

```js
import postcss from 'postcss';
import postcssColorMod from 'postcss-color-mod-function';

postcss([
  postcssColorMod(/* options */)
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS color-mod() Function] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssColorMod from 'postcss-color-mod-function';

gulp.task('css',
  () => gulp.src('./src/*.css')
  .pipe( postcss([ postcssColorMod(/* options */) ]) )
  .pipe( gulp.dest('.') );
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS color-mod() Function] in your Gruntfile:

```js
import postcssColorMod from 'postcss-color-mod-function';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [ postcssColorMod(/* options */) ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

---

## Options

### stringifier

The `stringifier` option defines how transformed colors will be produced in CSS.
By default, legacy `rbg()` and `rgba()` colors are produced, but this can be
easily updated to support [CSS Color Module Level 4 colors] colors.

```js
import postcssColorMod from 'postcss-color-mod-function';

postcssColorMod({
  stringifier(color) {
    return color.toString(); // use CSS Color Module Level 4 colors (rgb, hsl, hwb)
  }
});
```

Future major releases of [PostCSS color-mod() Function] may reverse this
functionality so that CSS Color Module Level 4 colors are produced by default.

### unresolved

The `unresolved` option defines how unresolved functions and arguments should
be handled. The available options are `throw`, `warn`, and `ignore`. The
default option is to `throw`.

If `ignore` is used, the `color-mod()` function will remain unchanged.

```js
import postcssColorMod from 'postcss-color-mod-function';

postcssColorMod({
  unresolved: 'ignore' // ignore unresolved color-mod() functions
});
```

### transformVars

The `transformVars` option defines whether `var()` variables used within
`color-mod()` should be transformed into their corresponding Custom Properties
available in `:root`, or their fallback value if it is specified. By default,
`var()` variables will be transformed.

However, because these transformations occur at build time, they cannot be
considered accurate. Accurately resolving cascading variables relies on
knowledge of the living DOM tree.

[npm-url]: https://www.npmjs.com/package/postcss-color-mod-function
[npm-img]: https://img.shields.io/npm/v/postcss-color-mod-function.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-color-mod-function
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-color-mod-function.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-color-mod-function
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-color-mod-function.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[CSS Color Module Level 4]: https://www.w3.org/TR/css-color-4/#funcdef-color-mod
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS color-mod() Function]: https://github.com/jonathantneal/postcss-color-mod-function
