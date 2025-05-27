# Installing PostCSS Color Mix Variadic Function Arguments

[PostCSS Color Mix Variadic Function Arguments] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Color Mix Variadic Function Arguments] to your project:

```bash
npm install postcss @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssColorMixVariadicFunctionArguments = require('@csstools/postcss-color-mix-variadic-function-arguments');

postcss([
	postcssColorMixVariadicFunctionArguments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssColorMixVariadicFunctionArguments from '@csstools/postcss-color-mix-variadic-function-arguments';

postcss([
	postcssColorMixVariadicFunctionArguments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

Use [PostCSS Color Mix Variadic Function Arguments] in your `postcss.config.js` configuration file:

```js
const postcssColorMixVariadicFunctionArguments = require('@csstools/postcss-color-mix-variadic-function-arguments');

module.exports = {
	plugins: [
		postcssColorMixVariadicFunctionArguments(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-color-mix-variadic-function-arguments": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-color-mix-variadic-function-arguments": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

Use [PostCSS Color Mix Variadic Function Arguments] in your Webpack configuration:

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
										"@csstools/postcss-color-mix-variadic-function-arguments",
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
npm install @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

Use [PostCSS Color Mix Variadic Function Arguments] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-color-mix-variadic-function-arguments"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-color-mix-variadic-function-arguments",
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
npm install gulp-postcss @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

Use [PostCSS Color Mix Variadic Function Arguments] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssColorMixVariadicFunctionArguments = require('@csstools/postcss-color-mix-variadic-function-arguments');

gulp.task('css', function () {
	var plugins = [
		postcssColorMixVariadicFunctionArguments(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-color-mix-variadic-function-arguments --save-dev
```

Use [PostCSS Color Mix Variadic Function Arguments] in your Gruntfile:

```js
const postcssColorMixVariadicFunctionArguments = require('@csstools/postcss-color-mix-variadic-function-arguments');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssColorMixVariadicFunctionArguments(/* pluginOptions */)
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
[PostCSS Color Mix Variadic Function Arguments]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-mix-variadic-function-arguments
[Next.js]: https://nextjs.org
