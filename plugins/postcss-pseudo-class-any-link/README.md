# :any-link <a href="https://github.com/postcss/postcss"><img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right"></a>

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-image]][lic-url]
[![Changelog][log-image]][log-url]
[![Gitter Chat][git-image]][git-url]

[:any-link] lets you to use the proposed [`:any-link`] pseudo-class in CSS.

`:any-link` simplifies selectors targeting links, as the naming of `:link` is misleading; it specifically means unvisited links only, rather than all links.

```css
/* before */

nav :any-link > span {
	background-color: yellow;
}

/* after */

nav :link > span,
nav :visited > span {
	background-color: yellow;
}
```

From the [proposal]:

> The [`:any-link`] pseudo-class represents an element that acts as the source anchor of a hyperlink. It matches an element if the element would match [`:link`] or [`:visited`].

## Options

**prefix** (string): prepends a prefix (surrounded by dashes) to the pseudo-class, preventing any clash with native syntax.

```js
{
	prefix: 'foo' // pseudo-class becomes :-foo-any-link
}
```

## Usage

Add [:any-link] to your build tool:

```bash
npm install :any-link --save-dev
```

#### Node

```js
require(':any-link').process(YOUR_CSS, { /* options */ });
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [:any-link] as a PostCSS plugin:

```js
postcss([
	require(':any-link')({ /* options */ })
]).process(YOUR_CSS, /* options */);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [:any-link] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
	return gulp.src('./src/*.css').pipe(
		postcss([
			require(':any-link')({ /* options */ })
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

Enable [:any-link] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			use: [
				require(':any-link')({ /* options */ })
			]
		},
		dist: {
			src: '*.css'
		}
	}
});
```

### Alternatives

Here are a few other ways to simulate the effect of [PostCSS Pseudo-Class Any-Link].

```css
/* Use @custom-selector; supported nowhere yet */

@custom-selector :--any-link :link, :visited;

:--any-link { /* ... */ }

/* Use :matches; supported in Firefox 4+, Chrome 12+, Opera 15+, Safari 5.1+ */

:matches(:link, :visited) { /* ... */ }

/* Use :link and :visited; supported everywhere */

:link, :visited { /* ... */ }
```

[npm-url]: https://www.npmjs.com/package/postcss-pseudo-class-any-link
[npm-img]: https://img.shields.io/npm/v/postcss-pseudo-class-any-link.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-pseudo-class-any-link
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-pseudo-class-any-link.svg
[lic-url]: LICENSE.md
[lic-image]: https://img.shields.io/npm/l/postcss-pseudo-class-any-link.svg
[log-url]: CHANGELOG.md
[log-image]: https://img.shields.io/badge/changelog-md-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[git-image]: https://img.shields.io/badge/chat-gitter-blue.svg

[:any-link]: https://github.com/jonathantneal/postcss-pseudo-class-any-link
[`:any-link`]: http://dev.w3.org/csswg/selectors/#any-link-pseudo
[`:link`]: http://dev.w3.org/csswg/selectors/#link-pseudo
[`:visited`]: http://dev.w3.org/csswg/selectors/#visited-pseudo
[proposal]: http://dev.w3.org/csswg/selectors/
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
