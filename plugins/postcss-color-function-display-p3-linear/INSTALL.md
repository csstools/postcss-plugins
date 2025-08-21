# Installing PostCSS Color Function Display P3 Linear

[PostCSS Color Function Display P3 Linear] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Color Function Display P3 Linear] to your project:

```bash
npm install postcss @csstools/postcss-color-function-display-p3-linear --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssColorFunctionDisplayP3Linear = require('@csstools/postcss-color-function-display-p3-linear');

postcss([
	postcssColorFunctionDisplayP3Linear(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssColorFunctionDisplayP3Linear from '@csstools/postcss-color-function-display-p3-linear';

postcss([
	postcssColorFunctionDisplayP3Linear(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-color-function-display-p3-linear --save-dev
```

Use [PostCSS Color Function Display P3 Linear] in your `postcss.config.js` configuration file:

```js
const postcssColorFunctionDisplayP3Linear = require('@csstools/postcss-color-function-display-p3-linear');

module.exports = {
	plugins: [
		postcssColorFunctionDisplayP3Linear(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-color-function-display-p3-linear --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-color-function-display-p3-linear": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-color-function-display-p3-linear": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-color-function-display-p3-linear --save-dev
```

Use [PostCSS Color Function Display P3 Linear] in your Webpack configuration:

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
										"@csstools/postcss-color-function-display-p3-linear",
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
npm install @csstools/postcss-color-function-display-p3-linear --save-dev
```

Use [PostCSS Color Function Display P3 Linear] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-color-function-display-p3-linear"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-color-function-display-p3-linear",
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
npm install gulp-postcss @csstools/postcss-color-function-display-p3-linear --save-dev
```

Use [PostCSS Color Function Display P3 Linear] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssColorFunctionDisplayP3Linear = require('@csstools/postcss-color-function-display-p3-linear');

gulp.task('css', function () {
	var plugins = [
		postcssColorFunctionDisplayP3Linear(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-color-function-display-p3-linear --save-dev
```

Use [PostCSS Color Function Display P3 Linear] in your Gruntfile:

```js
const postcssColorFunctionDisplayP3Linear = require('@csstools/postcss-color-function-display-p3-linear');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssColorFunctionDisplayP3Linear(/* pluginOptions */)
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
[PostCSS Color Function Display P3 Linear]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-function-display-p3-linear
[Next.js]: https://nextjs.org
