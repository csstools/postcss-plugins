# Place <a href="https://github.com/postcss/postcss"><img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right"></a>

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-image]][lic-url]
[![Changelog][log-image]][log-url]
[![Gitter Chat][git-image]][git-url]

[Place] lets you use `place-*` properties as shorthands for `align-*` and `justify-*` per the [CSS Box Alignment Module Level 3].

```css
/* before */

.example {
	place-self: center;
	place-content: space-between center;
}

/* after */

.example {
	align-self: center;
	justify-self: center;
	align-content: space-between;
	justify-content: center;
}
```

## Options

#### `prefix`

Type: `String`  
Default: `null`

Specifies a prefix to be surrounded by dashes before the declaration (e.g. `prefix: 'x'` changes the detected property to `-x-place-content`).

## Usage

Add [Place] to your build tool:

```bash
npm install jonathantneal/postcss-place --save-dev
```

#### Node

```js
require('postcss-place').process(YOUR_CSS, { /* options */ });
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [Place] as a PostCSS plugin:

```js
postcss([
	require('postcss-place')({ /* options */ })
]).process(YOUR_CSS, /* options */);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [Place] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
	return gulp.src('./src/*.css').pipe(
		postcss([
			require('postcss-place')({ /* options */ })
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

Enable [Place] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			use: [
				require('postcss-place')({ /* options */ })
			]
		},
		dist: {
			src: '*.css'
		}
	}
});
```

[npm-url]: https://www.npmjs.com/package/postcss-place
[npm-img]: https://img.shields.io/npm/v/postcss-place.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-place
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-place.svg
[lic-url]: LICENSE.md
[lic-image]: https://img.shields.io/npm/l/postcss-place.svg
[log-url]: CHANGELOG.md
[log-image]: https://img.shields.io/badge/changelog-md-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[git-image]: https://img.shields.io/badge/chat-gitter-blue.svg

[Place]: https://github.com/jonathantneal/postcss-place
[CSS Box Alignment Module Level 3]: https://drafts.csswg.org/css-align/#propdef-place-content
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
