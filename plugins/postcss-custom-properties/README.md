# PostCSS Custom Properties [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Custom Properties] lets you use CSS Custom Properties in CSS, following
the [CSS Custom Properties for Cascading Variables] specification.

```css
:root {
  --color: red;
}

h1 {
  color: var(--color);
}

/* becomes */

:root {
  --color: red;
}

div {
  color: red;
  color: var(--color);
}
```

## Usage

Add [PostCSS Custom Properties] to your build tool:

```bash
npm install postcss-custom-properties --save-dev
```

#### Node

Use [PostCSS Custom Properties] to process your CSS:

```js
import postCSSCustomProperties from 'postcss-custom-properties';

postCSSCustomProperties.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Custom Properties] as a plugin:

```js
import postcss from 'gulp-postcss';
import postCSSCustomProperties from 'postcss-custom-properties';

postcss([
  postCSSCustomProperties()
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Custom Properties] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postCSSCustomProperties from 'postcss-custom-properties';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postCSSCustomProperties()
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

Use [PostCSS Custom Properties] in your Gruntfile:

```js
import postCSSCustomProperties from 'postcss-custom-properties';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postCSSCustomProperties()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### strict

The `strict` option determines whether a `var()` function should transform into
its specified fallback value. By default, the option is `true` because this
plugin can not verify if the computed `:root` value is valid or not.

```css
:root {
  --color: red;
}

div {
  color: var(--color, blue);
}

/* becomes */

:root {
  --color: red;
}

div {
  color: blue;
  color: var(--color, blue);
}
```

### preserve

The `preserve` option determines how Custom Properties should be preserved. By
default, this option is truthy and preserves declarations containing `var()`.

```css
:root {
  --color: red;
}

h1 {
  color: var(--color);
}

/* becomes */

:root {
  --color: red;
}

h1 {
  color: red;
  color: var(--color);
}
```

The option may also be set to `false`, where Custom Properties and declarations
containing `var()` will be removed:

```js
postCSSCustomProperties({
  variables: {
    preserve: false
  }
})
```

```css
:root {
  --color: red;
}

h1 {
  color: var(--color);
}

/* becomes */

h1 {
  color: red;
}
```

The option may also be set to `"preserve-computed"`, where Custom Properties
will remain, but declarations containing `var()` will be removed:

```js
postCSSCustomProperties({
  variables: {
    preserve: 'preserve-computed'
  }
})
```

```css
:root {
  --color: red;
}

h1 {
  color: var(--color);
}

/* becomes */

:root {
  --color: red;
}

h1 {
  color: red;
}
```

### variables

The `variables` option allows you to pass an object of variables into CSS, as if
they had been specified on `:root`.

```js
postCSSCustomProperties({
  variables: {
    color: 'red'
  }
})
```

```css
h1 {
  color: var(--color);
}

/* becomes */

h1 {
  color: red;
  color: var(--color);
}
```

Note that these definitions will override any that exist in the CSS, and that
the keys will be automatically prefixed (`--`) to make it easier to share
variables in your codebase.

### appendVariables

The `appendVariables` option determines whether Custom Properties will be
appended to your CSS file. By default, this option is `false`.

If enabled when `preserve` is set to `true` or `"computed"`, this option allows
you to append your variables at the end of your CSS:

```js
postCSSCustomProperties({
  appendVariables: true,
  variables: {
    color: 'red'
  }
})
```

```css
h1 {
  color: var(--color);
}

/* becomes */

h1 {
  color: red;
  color: var(--color);
}

:root {
  --color: red;
}
```

### warnings

The `warnings` option determines whether Custom Property related warnings should
be logged by the plugin or not. By default, warnings are set to `false` and are
not logged.

If enabled, the plugin will enable all warnings:

```js
postCSSCustomProperties({
  warnings: true
})
```

```css
h1 {
  color: var(--color);
}
```

```
variable '--color' is undefined and used without a fallback
```

### noValueNotifications

When warnings are enabled, the `noValueNotifications` option determines whether
undefined variables will throw a warning or an error. By default, it is set to
`warning`.

---

## Notes

As written in the specification, usage of `var()` is limited to property values.
Do not expect the plugin to transform `var()` in media queries or in selectors.

The transformation of Custom Properties done by this plugin _is not complete_
and **cannot be** because dynamic *cascading* variables based on custom
properties relies on the DOM tree. Since we do not know the DOM in the context
of this plugin, we cannot produce safe output. This plugin currently aims to
provide a future-proof way of using a **limited subset** of the features
provided by native CSS custom properties.

There is a separate plugin, [PostCSS CSS Variables], that attempts to guess the
context of Custom Properties without access to the DOM tree. This does not
[reflecting the specifications](https://github.com/MadLittleMods/postcss-css-variables/issues/4),
so be sure you understand the risks before you decide to use it.

## Contributing

Fork, work on a branch, install dependencies & run tests before submitting a PR.

```bash
$ git clone https://github.com/YOU/postcss-custom-properties.git
$ git checkout -b patch-1
$ npm install
$ npm test
```

---

## [Changelog](CHANGELOG.md)

## [License](LICENSE)

[npm-url]: https://www.npmjs.com/package/postcss-custom-properties
[npm-img]: https://img.shields.io/npm/v/postcss-custom-properties.svg
[css-url]: https://jonathantneal.github.io/css-db/#css-variables
[css-img]: https://jonathantneal.github.io/css-db/badge/css-variables.svg
[cli-url]: https://travis-ci.org/postcss/postcss-custom-properties
[cli-img]: https://img.shields.io/travis/postcss/postcss-custom-properties.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[CSS Custom Properties for Cascading Variables]: https://www.w3.org/TR/css-variables-1/
[PostCSS CSS Variables]: https://github.com/MadLittleMods/postcss-css-variables
[PostCSS Custom Properties]: https://github.com/postcss/postcss-custom-properties
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
