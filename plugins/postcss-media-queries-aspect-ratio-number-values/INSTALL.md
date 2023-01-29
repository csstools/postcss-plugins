# Installing PostCSS Media Queries Aspect-Ratio Number Values

[PostCSS Media Queries Aspect-Ratio Number Values] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Media Queries Aspect-Ratio Number Values] to your project:

```bash
npm install postcss @csstools/postcss-media-queries-aspect-ratio-number-values --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssMediaQueriesAspectRatioNumberValues = require('@csstools/postcss-media-queries-aspect-ratio-number-values');

postcss([
	postcssMediaQueriesAspectRatioNumberValues(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssMediaQueriesAspectRatioNumberValues from '@csstools/postcss-media-queries-aspect-ratio-number-values';

postcss([
	postcssMediaQueriesAspectRatioNumberValues(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-media-queries-aspect-ratio-number-values --save-dev
```

Use [PostCSS Media Queries Aspect-Ratio Number Values] in your `postcss.config.js` configuration file:

```js
const postcssMediaQueriesAspectRatioNumberValues = require('@csstools/postcss-media-queries-aspect-ratio-number-values');

module.exports = {
	plugins: [
		postcssMediaQueriesAspectRatioNumberValues(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-media-queries-aspect-ratio-number-values --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-media-queries-aspect-ratio-number-values": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-media-queries-aspect-ratio-number-values": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-media-queries-aspect-ratio-number-values --save-dev
```

Use [PostCSS Media Queries Aspect-Ratio Number Values] in your Webpack configuration:

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
										"@csstools/postcss-media-queries-aspect-ratio-number-values",
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
npm install @csstools/postcss-media-queries-aspect-ratio-number-values --save-dev
```

Use [PostCSS Media Queries Aspect-Ratio Number Values] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-media-queries-aspect-ratio-number-values"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-media-queries-aspect-ratio-number-values",
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
npm install gulp-postcss @csstools/postcss-media-queries-aspect-ratio-number-values --save-dev
```

Use [PostCSS Media Queries Aspect-Ratio Number Values] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssMediaQueriesAspectRatioNumberValues = require('@csstools/postcss-media-queries-aspect-ratio-number-values');

gulp.task('css', function () {
	var plugins = [
		postcssMediaQueriesAspectRatioNumberValues(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-media-queries-aspect-ratio-number-values --save-dev
```

Use [PostCSS Media Queries Aspect-Ratio Number Values] in your Gruntfile:

```js
const postcssMediaQueriesAspectRatioNumberValues = require('@csstools/postcss-media-queries-aspect-ratio-number-values');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssMediaQueriesAspectRatioNumberValues(/* pluginOptions */)
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
[PostCSS Media Queries Aspect-Ratio Number Values]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-media-queries-aspect-ratio-number-values
[Next.js]: https://nextjs.org
