# Installing PostCSS System UI Font Family

[PostCSS System UI Font Family] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS System UI Font Family] to your project:

```bash
npm install postcss @csstools/postcss-system-ui-font-family --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssSystemUIFontFamily = require('@csstools/postcss-system-ui-font-family');

postcss([
	postcssSystemUIFontFamily(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssSystemUIFontFamily from '@csstools/postcss-system-ui-font-family';

postcss([
	postcssSystemUIFontFamily(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-system-ui-font-family --save-dev
```

Use [PostCSS System UI Font Family] in your `postcss.config.js` configuration file:

```js
const postcssSystemUIFontFamily = require('@csstools/postcss-system-ui-font-family');

module.exports = {
	plugins: [
		postcssSystemUIFontFamily(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-system-ui-font-family --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-system-ui-font-family": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-system-ui-font-family": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-system-ui-font-family --save-dev
```

Use [PostCSS System UI Font Family] in your Webpack configuration:

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
										"@csstools/postcss-system-ui-font-family",
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
npm install @csstools/postcss-system-ui-font-family --save-dev
```

Use [PostCSS System UI Font Family] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-system-ui-font-family"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-system-ui-font-family",
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
npm install gulp-postcss @csstools/postcss-system-ui-font-family --save-dev
```

Use [PostCSS System UI Font Family] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssSystemUIFontFamily = require('@csstools/postcss-system-ui-font-family');

gulp.task('css', function () {
	var plugins = [
		postcssSystemUIFontFamily(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-system-ui-font-family --save-dev
```

Use [PostCSS System UI Font Family] in your Gruntfile:

```js
const postcssSystemUIFontFamily = require('@csstools/postcss-system-ui-font-family');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssSystemUIFontFamily(/* pluginOptions */)
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
[PostCSS System UI Font Family]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-system-ui-font-family
[Next.js]: https://nextjs.org
