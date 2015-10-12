# CSS Nesting [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[CSS Nesting] allows you to nest one style rule inside another, following the [CSS Nesting Module Level 3] specification.

```css
/* before */

a, b {
	color: red;

	@nest & c, & d {
		color: white;
	}

	@nest & & {
		color: blue;
	}

	@nest &:hover {
		color: black;
	}

	@media (min-width: 30em) {
		color: yellow;
	}
}

/* after */

a, b {
    color: red;
}

a c, a d, b c, b d {
    color: white;
}

a a, b b {
    color: blue;
}

a:hover, b:hover {
    color: black;
}

@media (min-width: 30em) {
    a, b {
        color: yellow;
    }
}
```

## Usage

Follow these steps to use [CSS Nesting].

Add [CSS Nesting] to your build tool:

```bash
npm install postcss-nesting --save-dev
```

#### Node

Use [CSS Nesting] directly:

```js
require('postcss-nesting')({ /* options */ }).process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [CSS Nesting] as a PostCSS plugin:

```js
postcss([
	require('postcss-nesting')({ /* options */ })
]);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [CSS Nesting] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
	return gulp.src('./css/src/*.css').pipe(
		postcss([
			require('postcss-nesting')({ /* options */ })
		])
	).pipe(
		gulp.dest('./css')
	);
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [CSS Nesting] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
				require('postcss-nesting')({ /* options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

## Options

#### `bubble`

Type: `Array`  
Default: `['document', 'media', 'supports']`

Specifies additional at-rules whose contents should be transpiled so that the at-rule comes first. By default, `@media`, `@supports` and `@document` will do this.

#### `prefix`

Type: `String`  
Default: `null`

Specifies a prefix to be surrounded by dashes before the `@nest` at-rule (e.g. `@-x-nest`).

[ci]: https://travis-ci.org/jonathantneal/postcss-nesting
[ci-img]: https://travis-ci.org/jonathantneal/postcss-nesting.svg
[CSS Nesting]: https://github.com/jonathantneal/postcss-nesting
[CSS Nesting Module Level 3]: http://tabatkins.github.io/specs/css-nesting/
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
