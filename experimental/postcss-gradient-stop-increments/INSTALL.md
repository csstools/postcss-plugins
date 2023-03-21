# Installing PostCSS Gradient Stop Increments

[PostCSS Gradient Stop Increments] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Gradient Stop Increments] to your project:

```bash
npm install postcss @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssGradientStopIncrementsExperimental = require('@csstools/postcss-gradient-stop-increments-experimental');

postcss([
	postcssGradientStopIncrementsExperimental(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssGradientStopIncrementsExperimental from '@csstools/postcss-gradient-stop-increments-experimental';

postcss([
	postcssGradientStopIncrementsExperimental(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

Use [PostCSS Gradient Stop Increments] in your `postcss.config.js` configuration file:

```js
const postcssGradientStopIncrementsExperimental = require('@csstools/postcss-gradient-stop-increments-experimental');

module.exports = {
	plugins: [
		postcssGradientStopIncrementsExperimental(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-gradient-stop-increments-experimental": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-gradient-stop-increments-experimental": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

Use [PostCSS Gradient Stop Increments] in your Webpack configuration:

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
										"@csstools/postcss-gradient-stop-increments-experimental",
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
npm install @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

Use [PostCSS Gradient Stop Increments] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-gradient-stop-increments-experimental"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-gradient-stop-increments-experimental",
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
npm install gulp-postcss @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

Use [PostCSS Gradient Stop Increments] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssGradientStopIncrementsExperimental = require('@csstools/postcss-gradient-stop-increments-experimental');

gulp.task('css', function () {
	var plugins = [
		postcssGradientStopIncrementsExperimental(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-gradient-stop-increments-experimental --save-dev
```

Use [PostCSS Gradient Stop Increments] in your Gruntfile:

```js
const postcssGradientStopIncrementsExperimental = require('@csstools/postcss-gradient-stop-increments-experimental');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssGradientStopIncrementsExperimental(/* pluginOptions */)
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
[PostCSS Gradient Stop Increments]: https://github.com/csstools/postcss-plugins/tree/main/experimental/postcss-gradient-stop-increments
[Next.js]: https://nextjs.org
