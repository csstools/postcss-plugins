# Installing PostCSS Font Width Property

[PostCSS Font Width Property] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Font Width Property] to your project:

```bash
npm install postcss @csstools/postcss-font-width-property --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssFontWidthProperty = require('@csstools/postcss-font-width-property');

postcss([
	postcssFontWidthProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssFontWidthProperty from '@csstools/postcss-font-width-property';

postcss([
	postcssFontWidthProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-font-width-property --save-dev
```

Use [PostCSS Font Width Property] in your `postcss.config.js` configuration file:

```js
const postcssFontWidthProperty = require('@csstools/postcss-font-width-property');

module.exports = {
	plugins: [
		postcssFontWidthProperty(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-font-width-property --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-font-width-property": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-font-width-property": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-font-width-property --save-dev
```

Use [PostCSS Font Width Property] in your Webpack configuration:

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
										"@csstools/postcss-font-width-property",
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
npm install @csstools/postcss-font-width-property --save-dev
```

Use [PostCSS Font Width Property] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-font-width-property"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-font-width-property",
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
npm install gulp-postcss @csstools/postcss-font-width-property --save-dev
```

Use [PostCSS Font Width Property] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssFontWidthProperty = require('@csstools/postcss-font-width-property');

gulp.task('css', function () {
	var plugins = [
		postcssFontWidthProperty(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-font-width-property --save-dev
```

Use [PostCSS Font Width Property] in your Gruntfile:

```js
const postcssFontWidthProperty = require('@csstools/postcss-font-width-property');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssFontWidthProperty(/* pluginOptions */)
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
[PostCSS Font Width Property]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-font-width-property
[Next.js]: https://nextjs.org
