# Installing PostCSS image-set() Function

[PostCSS image-set() Function] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS image-set() Function] to your project:

```bash
npm install postcss postcss-image-set-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssImageSetFunction = require('postcss-image-set-function');

postcss([
	postcssImageSetFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssImageSetFunction from 'postcss-image-set-function';

postcss([
	postcssImageSetFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-image-set-function --save-dev
```

Use [PostCSS image-set() Function] in your `postcss.config.js` configuration file:

```js
const postcssImageSetFunction = require('postcss-image-set-function');

module.exports = {
	plugins: [
		postcssImageSetFunction(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-image-set-function --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-image-set-function": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-image-set-function": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-image-set-function --save-dev
```

Use [PostCSS image-set() Function] in your Webpack configuration:

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
										"postcss-image-set-function",
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
npm install postcss-image-set-function --save-dev
```

Use [PostCSS image-set() Function] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-image-set-function"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-image-set-function",
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
npm install gulp-postcss postcss-image-set-function --save-dev
```

Use [PostCSS image-set() Function] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssImageSetFunction = require('postcss-image-set-function');

gulp.task('css', function () {
	var plugins = [
		postcssImageSetFunction(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-image-set-function --save-dev
```

Use [PostCSS image-set() Function] in your Gruntfile:

```js
const postcssImageSetFunction = require('postcss-image-set-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssImageSetFunction(/* pluginOptions */)
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
[PostCSS image-set() Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-image-set-function
[Next.js]: https://nextjs.org
