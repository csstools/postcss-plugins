# Installing PostCSS Has Pseudo

[PostCSS Has Pseudo] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Has Pseudo] to your project:

```bash
npm install postcss css-has-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssHasPseudo = require('css-has-pseudo');

postcss([
	postcssHasPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssHasPseudo from 'css-has-pseudo';

postcss([
	postcssHasPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli css-has-pseudo --save-dev
```

Use [PostCSS Has Pseudo] in your `postcss.config.js` configuration file:

```js
const postcssHasPseudo = require('css-has-pseudo');

module.exports = {
	plugins: [
		postcssHasPseudo(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install css-has-pseudo --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"css-has-pseudo": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"css-has-pseudo": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader css-has-pseudo --save-dev
```

Use [PostCSS Has Pseudo] in your Webpack configuration:

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
										"css-has-pseudo",
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
npm install css-has-pseudo --save-dev
```

Use [PostCSS Has Pseudo] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"css-has-pseudo"
	]
}
```

```json5
{
	"plugins": [
		[
			"css-has-pseudo",
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
npm install gulp-postcss css-has-pseudo --save-dev
```

Use [PostCSS Has Pseudo] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssHasPseudo = require('css-has-pseudo');

gulp.task('css', function () {
	var plugins = [
		postcssHasPseudo(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss css-has-pseudo --save-dev
```

Use [PostCSS Has Pseudo] in your Gruntfile:

```js
const postcssHasPseudo = require('css-has-pseudo');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssHasPseudo(/* pluginOptions */)
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
[PostCSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo
[Next.js]: https://nextjs.org
