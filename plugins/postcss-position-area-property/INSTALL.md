# Installing PostCSS Position Area Property

[PostCSS Position Area Property] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Position Area Property] to your project:

```bash
npm install postcss @csstools/postcss-position-area-property --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssPositionAreaProperty = require('@csstools/postcss-position-area-property');

postcss([
	postcssPositionAreaProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssPositionAreaProperty from '@csstools/postcss-position-area-property';

postcss([
	postcssPositionAreaProperty(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-position-area-property --save-dev
```

Use [PostCSS Position Area Property] in your `postcss.config.js` configuration file:

```js
const postcssPositionAreaProperty = require('@csstools/postcss-position-area-property');

module.exports = {
	plugins: [
		postcssPositionAreaProperty(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-position-area-property --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-position-area-property": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-position-area-property": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-position-area-property --save-dev
```

Use [PostCSS Position Area Property] in your Webpack configuration:

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
										"@csstools/postcss-position-area-property",
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
npm install @csstools/postcss-position-area-property --save-dev
```

Use [PostCSS Position Area Property] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-position-area-property"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-position-area-property",
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
npm install gulp-postcss @csstools/postcss-position-area-property --save-dev
```

Use [PostCSS Position Area Property] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssPositionAreaProperty = require('@csstools/postcss-position-area-property');

gulp.task('css', function () {
	var plugins = [
		postcssPositionAreaProperty(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-position-area-property --save-dev
```

Use [PostCSS Position Area Property] in your Gruntfile:

```js
const postcssPositionAreaProperty = require('@csstools/postcss-position-area-property');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssPositionAreaProperty(/* pluginOptions */)
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
[PostCSS Position Area Property]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-position-area-property
[Next.js]: https://nextjs.org
