# Installing PostCSS Font Weights

[PostCSS Font Weights] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Font Weights] to your project:

```bash
npm install postcss postcss-font-weights --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssFontWeights = require('postcss-font-weights');

postcss([
	postcssFontWeights(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssFontWeights from 'postcss-font-weights';

postcss([
	postcssFontWeights(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-font-weights --save-dev
```

Use [PostCSS Font Weights] in your `postcss.config.js` configuration file:

```js
const postcssFontWeights = require('postcss-font-weights');

module.exports = {
	plugins: [
		postcssFontWeights(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-font-weights --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-font-weights": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-font-weights": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-font-weights --save-dev
```

Use [PostCSS Font Weights] in your Webpack configuration:

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
										"postcss-font-weights",
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
npm install postcss-font-weights --save-dev
```

Use [PostCSS Font Weights] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-font-weights"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-font-weights",
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
npm install gulp-postcss postcss-font-weights --save-dev
```

Use [PostCSS Font Weights] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssFontWeights = require('postcss-font-weights');

gulp.task('css', function () {
	var plugins = [
		postcssFontWeights(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-font-weights --save-dev
```

Use [PostCSS Font Weights] in your Gruntfile:

```js
const postcssFontWeights = require('postcss-font-weights');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssFontWeights(/* pluginOptions */)
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
[PostCSS Font Weights]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-font-weights
[Next.js]: https://nextjs.org
