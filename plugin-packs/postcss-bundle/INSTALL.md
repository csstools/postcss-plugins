# Installing PostCSS Bundle

[PostCSS Bundle] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Bundle] to your project:

```bash
npm install postcss @csstools/postcss-bundle --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssBundle = require('@csstools/postcss-bundle');

postcss([
	postcssBundle(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssBundle from '@csstools/postcss-bundle';

postcss([
	postcssBundle(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-bundle --save-dev
```

Use [PostCSS Bundle] in your `postcss.config.js` configuration file:

```js
const postcssBundle = require('@csstools/postcss-bundle');

module.exports = {
	plugins: [
		postcssBundle(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-bundle --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-bundle": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-bundle": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-bundle --save-dev
```

Use [PostCSS Bundle] in your Webpack configuration:

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
										"@csstools/postcss-bundle",
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
npm install @csstools/postcss-bundle --save-dev
```

Use [PostCSS Bundle] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-bundle"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-bundle",
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
npm install gulp-postcss @csstools/postcss-bundle --save-dev
```

Use [PostCSS Bundle] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssBundle = require('@csstools/postcss-bundle');

gulp.task('css', function () {
	var plugins = [
		postcssBundle(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-bundle --save-dev
```

Use [PostCSS Bundle] in your Gruntfile:

```js
const postcssBundle = require('@csstools/postcss-bundle');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssBundle(/* pluginOptions */)
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
[PostCSS Bundle]: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundle
[Next.js]: https://nextjs.org
