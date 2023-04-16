# Installing PostCSS Relative Color Syntax

[PostCSS Relative Color Syntax] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Relative Color Syntax] to your project:

```bash
npm install postcss @csstools/postcss-relative-color-syntax --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssRelativeColorSyntax = require('@csstools/postcss-relative-color-syntax');

postcss([
	postcssRelativeColorSyntax(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssRelativeColorSyntax from '@csstools/postcss-relative-color-syntax';

postcss([
	postcssRelativeColorSyntax(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-relative-color-syntax --save-dev
```

Use [PostCSS Relative Color Syntax] in your `postcss.config.js` configuration file:

```js
const postcssRelativeColorSyntax = require('@csstools/postcss-relative-color-syntax');

module.exports = {
	plugins: [
		postcssRelativeColorSyntax(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-relative-color-syntax --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-relative-color-syntax": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-relative-color-syntax": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-relative-color-syntax --save-dev
```

Use [PostCSS Relative Color Syntax] in your Webpack configuration:

```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: { importLoaders: 1 },
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									// Other plugins,
									[
										"@csstools/postcss-relative-color-syntax",
										{
											// Options
										},
									],
								],
							},
						},
					},
				],
			},
		],
	},
};
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install @csstools/postcss-relative-color-syntax --save-dev
```

Use [PostCSS Relative Color Syntax] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-relative-color-syntax"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-relative-color-syntax",
			{
				// Optionally add plugin options
			}
		]
	]
}
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-relative-color-syntax --save-dev
```

Use [PostCSS Relative Color Syntax] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssRelativeColorSyntax = require('@csstools/postcss-relative-color-syntax');

gulp.task('css', function () {
	var plugins = [
		postcssRelativeColorSyntax(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-relative-color-syntax --save-dev
```

Use [PostCSS Relative Color Syntax] in your Gruntfile:

```js
const postcssRelativeColorSyntax = require('@csstools/postcss-relative-color-syntax');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssRelativeColorSyntax(/* pluginOptions */)
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
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Relative Color Syntax]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-relative-color-syntax
[Next.js]: https://nextjs.org
