# Installing PostCSS Exponential Functions

[PostCSS Exponential Functions] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Exponential Functions] to your project:

```bash
npm install postcss @csstools/postcss-exponential-functions --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssExponentialFunctions = require('@csstools/postcss-exponential-functions');

postcss([
	postcssExponentialFunctions(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssExponentialFunctions from '@csstools/postcss-exponential-functions';

postcss([
	postcssExponentialFunctions(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-exponential-functions --save-dev
```

Use [PostCSS Exponential Functions] in your `postcss.config.js` configuration file:

```js
const postcssExponentialFunctions = require('@csstools/postcss-exponential-functions');

module.exports = {
	plugins: [
		postcssExponentialFunctions(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-exponential-functions --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-exponential-functions": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-exponential-functions": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-exponential-functions --save-dev
```

Use [PostCSS Exponential Functions] in your Webpack configuration:

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
										"@csstools/postcss-exponential-functions",
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
npm install @csstools/postcss-exponential-functions --save-dev
```

Use [PostCSS Exponential Functions] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-exponential-functions"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-exponential-functions",
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
npm install gulp-postcss @csstools/postcss-exponential-functions --save-dev
```

Use [PostCSS Exponential Functions] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssExponentialFunctions = require('@csstools/postcss-exponential-functions');

gulp.task('css', function () {
	var plugins = [
		postcssExponentialFunctions(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-exponential-functions --save-dev
```

Use [PostCSS Exponential Functions] in your Gruntfile:

```js
const postcssExponentialFunctions = require('@csstools/postcss-exponential-functions');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssExponentialFunctions(/* pluginOptions */)
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
[PostCSS Exponential Functions]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-exponential-functions
[Next.js]: https://nextjs.org
