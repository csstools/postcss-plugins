# Installing PostCSS Contrast Color Function

[PostCSS Contrast Color Function] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Contrast Color Function] to your project:

```bash
npm install postcss @csstools/postcss-contrast-color-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssContrastColorFunction = require('@csstools/postcss-contrast-color-function');

postcss([
	postcssContrastColorFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssContrastColorFunction from '@csstools/postcss-contrast-color-function';

postcss([
	postcssContrastColorFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-contrast-color-function --save-dev
```

Use [PostCSS Contrast Color Function] in your `postcss.config.js` configuration file:

```js
const postcssContrastColorFunction = require('@csstools/postcss-contrast-color-function');

module.exports = {
	plugins: [
		postcssContrastColorFunction(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-contrast-color-function --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-contrast-color-function": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-contrast-color-function": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-contrast-color-function --save-dev
```

Use [PostCSS Contrast Color Function] in your Webpack configuration:

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
										"@csstools/postcss-contrast-color-function",
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
npm install @csstools/postcss-contrast-color-function --save-dev
```

Use [PostCSS Contrast Color Function] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-contrast-color-function"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-contrast-color-function",
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
npm install gulp-postcss @csstools/postcss-contrast-color-function --save-dev
```

Use [PostCSS Contrast Color Function] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssContrastColorFunction = require('@csstools/postcss-contrast-color-function');

gulp.task('css', function () {
	var plugins = [
		postcssContrastColorFunction(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-contrast-color-function --save-dev
```

Use [PostCSS Contrast Color Function] in your Gruntfile:

```js
const postcssContrastColorFunction = require('@csstools/postcss-contrast-color-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssContrastColorFunction(/* pluginOptions */)
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
[PostCSS Contrast Color Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-contrast-color-function
[Next.js]: https://nextjs.org
