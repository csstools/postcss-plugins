# Installing PostCSS Light Dark Function

[PostCSS Light Dark Function] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Light Dark Function] to your project:

```bash
npm install postcss @csstools/postcss-light-dark-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssLightDarkFunction = require('@csstools/postcss-light-dark-function');

postcss([
	postcssLightDarkFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssLightDarkFunction from '@csstools/postcss-light-dark-function';

postcss([
	postcssLightDarkFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-light-dark-function --save-dev
```

Use [PostCSS Light Dark Function] in your `postcss.config.js` configuration file:

```js
const postcssLightDarkFunction = require('@csstools/postcss-light-dark-function');

module.exports = {
	plugins: [
		postcssLightDarkFunction(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-light-dark-function --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-light-dark-function": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-light-dark-function": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-light-dark-function --save-dev
```

Use [PostCSS Light Dark Function] in your Webpack configuration:

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
										"@csstools/postcss-light-dark-function",
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
npm install @csstools/postcss-light-dark-function --save-dev
```

Use [PostCSS Light Dark Function] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-light-dark-function"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-light-dark-function",
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
npm install gulp-postcss @csstools/postcss-light-dark-function --save-dev
```

Use [PostCSS Light Dark Function] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssLightDarkFunction = require('@csstools/postcss-light-dark-function');

gulp.task('css', function () {
	var plugins = [
		postcssLightDarkFunction(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-light-dark-function --save-dev
```

Use [PostCSS Light Dark Function] in your Gruntfile:

```js
const postcssLightDarkFunction = require('@csstools/postcss-light-dark-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssLightDarkFunction(/* pluginOptions */)
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
[PostCSS Light Dark Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-light-dark-function
[Next.js]: https://nextjs.org
