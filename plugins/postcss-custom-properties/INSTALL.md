# Installing PostCSS Custom Properties

[PostCSS Custom Properties] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

> [!IMPORTANT]
> [PostCSS Custom Properties] assumes to process your complete CSS bundle.<br>If your build tool processes files individually or processes files in parallel the output will be incorrect.<br>Using [`@csstools/postcss-bundler`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler) and `@import` statements is one way to make sure your CSS is bundled before it is processed by this plugin.


## Node

Add [PostCSS Custom Properties] to your project:

```bash
npm install postcss postcss-custom-properties --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssCustomProperties = require('postcss-custom-properties');

postcss([
	postcssCustomProperties(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssCustomProperties from 'postcss-custom-properties';

postcss([
	postcssCustomProperties(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] in your `postcss.config.js` configuration file:

```js
const postcssCustomProperties = require('postcss-custom-properties');

module.exports = {
	plugins: [
		postcssCustomProperties(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-custom-properties --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-custom-properties": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-custom-properties": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] in your Webpack configuration:

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
									["@csstools/postcss-bundler"],
									[
										"postcss-custom-properties",
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
npm install postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-custom-properties"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-custom-properties",
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
npm install gulp-postcss postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');

gulp.task('css', function () {
	var plugins = [
		postcssCustomProperties(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] in your Gruntfile:

```js
const postcssCustomProperties = require('postcss-custom-properties');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssCustomProperties(/* pluginOptions */)
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
[PostCSS Custom Properties]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-properties
[Next.js]: https://nextjs.org
