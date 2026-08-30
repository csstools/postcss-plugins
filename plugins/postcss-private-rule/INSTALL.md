# Installing PostCSS Private Rule

[PostCSS Private Rule] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Private Rule] to your project:

```bash
npm install postcss @csstools/postcss-private-rule --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssPrivateRule = require('@csstools/postcss-private-rule');

postcss([
	postcssPrivateRule(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssPrivateRule from '@csstools/postcss-private-rule';

postcss([
	postcssPrivateRule(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-private-rule --save-dev
```

Use [PostCSS Private Rule] in your `postcss.config.js` configuration file:

```js
const postcssPrivateRule = require('@csstools/postcss-private-rule');

module.exports = {
	plugins: [
		postcssPrivateRule(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-private-rule --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-private-rule": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-private-rule": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-private-rule --save-dev
```

Use [PostCSS Private Rule] in your Webpack configuration:

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
										"@csstools/postcss-private-rule",
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
npm install @csstools/postcss-private-rule --save-dev
```

Use [PostCSS Private Rule] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-private-rule"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-private-rule",
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
npm install gulp-postcss @csstools/postcss-private-rule --save-dev
```

Use [PostCSS Private Rule] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssPrivateRule = require('@csstools/postcss-private-rule');

gulp.task('css', function () {
	var plugins = [
		postcssPrivateRule(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-private-rule --save-dev
```

Use [PostCSS Private Rule] in your Gruntfile:

```js
const postcssPrivateRule = require('@csstools/postcss-private-rule');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssPrivateRule(/* pluginOptions */)
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
[PostCSS Private Rule]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-private-rule
[Next.js]: https://nextjs.org
