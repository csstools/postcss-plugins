# Installing PostCSS Sign Functions

[PostCSS Sign Functions] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Sign Functions] to your project:

```bash
npm install postcss @csstools/postcss-sign-functions --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssSignFunctions = require('@csstools/postcss-sign-functions');

postcss([
	postcssSignFunctions(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssSignFunctions from '@csstools/postcss-sign-functions';

postcss([
	postcssSignFunctions(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-sign-functions --save-dev
```

Use [PostCSS Sign Functions] in your `postcss.config.js` configuration file:

```js
const postcssSignFunctions = require('@csstools/postcss-sign-functions');

module.exports = {
	plugins: [
		postcssSignFunctions(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-sign-functions --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-sign-functions": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-sign-functions": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-sign-functions --save-dev
```

Use [PostCSS Sign Functions] in your Webpack configuration:

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
										"@csstools/postcss-sign-functions",
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
npm install @csstools/postcss-sign-functions --save-dev
```

Use [PostCSS Sign Functions] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-sign-functions"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-sign-functions",
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
npm install gulp-postcss @csstools/postcss-sign-functions --save-dev
```

Use [PostCSS Sign Functions] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssSignFunctions = require('@csstools/postcss-sign-functions');

gulp.task('css', function () {
	var plugins = [
		postcssSignFunctions(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-sign-functions --save-dev
```

Use [PostCSS Sign Functions] in your Gruntfile:

```js
const postcssSignFunctions = require('@csstools/postcss-sign-functions');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssSignFunctions(/* pluginOptions */)
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
[PostCSS Sign Functions]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-sign-functions
[Next.js]: https://nextjs.org
