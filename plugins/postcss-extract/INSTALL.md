# Installing PostCSS Extract

[PostCSS Extract] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Extract] to your project:

```bash
npm install postcss @csstools/postcss-extract --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssExtract = require('@csstools/postcss-extract');

postcss([
	postcssExtract(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-extract --save-dev
```

Use [PostCSS Extract] in your `postcss.config.js` configuration file:

```js
const postcssExtract = require('@csstools/postcss-extract');

module.exports = {
	plugins: [
		postcssExtract(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-extract --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-extract": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-extract": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-extract --save-dev
```

Use [PostCSS Extract] in your Webpack configuration:

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
									[
										"@csstools/postcss-extract",
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

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-extract --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Extract] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssExtract = require('@csstools/postcss-extract');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssExtract(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install @csstools/postcss-extract --save-dev
```

Use [PostCSS Extract] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-extract"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-extract",
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
npm install gulp-postcss @csstools/postcss-extract --save-dev
```

Use [PostCSS Extract] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssExtract = require('@csstools/postcss-extract');

gulp.task('css', function () {
	var plugins = [
		postcssExtract(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-extract --save-dev
```

Use [PostCSS Extract] in your Gruntfile:

```js
const postcssExtract = require('@csstools/postcss-extract');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssExtract(/* pluginOptions */)
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
[PostCSS Extract]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-extract
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
