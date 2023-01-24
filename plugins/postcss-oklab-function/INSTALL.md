# Installing PostCSS OKLab Function

[PostCSS OKLab Function] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS OKLab Function] to your project:

```bash
npm install postcss @csstools/postcss-oklab-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

postcss([
	postcssOKLabFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssOKLabFunction from '@csstools/postcss-oklab-function';

postcss([
	postcssOKLabFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your `postcss.config.js` configuration file:

```js
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

module.exports = {
	plugins: [
		postcssOKLabFunction(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-oklab-function --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-oklab-function": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-oklab-function": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your Webpack configuration:

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
										"@csstools/postcss-oklab-function",
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
npm install @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-oklab-function"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-oklab-function",
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
npm install gulp-postcss @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

gulp.task('css', function () {
	var plugins = [
		postcssOKLabFunction(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-oklab-function --save-dev
```

Use [PostCSS OKLab Function] in your Gruntfile:

```js
const postcssOKLabFunction = require('@csstools/postcss-oklab-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssOKLabFunction(/* pluginOptions */)
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
[PostCSS OKLab Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-oklab-function
[Next.js]: https://nextjs.org
