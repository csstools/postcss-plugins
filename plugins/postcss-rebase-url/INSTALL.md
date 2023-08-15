# Installing PostCSS Rebase URL

[PostCSS Rebase URL] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Rebase URL] to your project:

```bash
npm install postcss @csstools/postcss-rebase-url --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssRebaseURL = require('@csstools/postcss-rebase-url');

postcss([
	postcssRebaseURL(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssRebaseURL from '@csstools/postcss-rebase-url';

postcss([
	postcssRebaseURL(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-rebase-url --save-dev
```

Use [PostCSS Rebase URL] in your `postcss.config.js` configuration file:

```js
const postcssRebaseURL = require('@csstools/postcss-rebase-url');

module.exports = {
	plugins: [
		postcssRebaseURL(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-rebase-url --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-rebase-url": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-rebase-url": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-rebase-url --save-dev
```

Use [PostCSS Rebase URL] in your Webpack configuration:

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
										"@csstools/postcss-rebase-url",
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
npm install @csstools/postcss-rebase-url --save-dev
```

Use [PostCSS Rebase URL] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-rebase-url"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-rebase-url",
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
npm install gulp-postcss @csstools/postcss-rebase-url --save-dev
```

Use [PostCSS Rebase URL] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssRebaseURL = require('@csstools/postcss-rebase-url');

gulp.task('css', function () {
	var plugins = [
		postcssRebaseURL(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-rebase-url --save-dev
```

Use [PostCSS Rebase URL] in your Gruntfile:

```js
const postcssRebaseURL = require('@csstools/postcss-rebase-url');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssRebaseURL(/* pluginOptions */)
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
[PostCSS Rebase URL]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rebase-url
[Next.js]: https://nextjs.org
