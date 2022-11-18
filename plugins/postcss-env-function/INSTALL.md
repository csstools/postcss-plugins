# Installing PostCSS Environment Variables

[PostCSS Environment Variables] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Environment Variables] to your project:

```bash
npm install postcss postcss-env-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssEnvFunction = require('postcss-env-function');

postcss([
	postcssEnvFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-env-function --save-dev
```

Use [PostCSS Environment Variables] in your `postcss.config.js` configuration file:

```js
const postcssEnvFunction = require('postcss-env-function');

module.exports = {
	plugins: [
		postcssEnvFunction(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-env-function --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-env-function": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-env-function": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-env-function --save-dev
```

Use [PostCSS Environment Variables] in your Webpack configuration:

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
										"postcss-env-function",
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
npm install react-app-rewired react-app-rewire-postcss postcss-env-function --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Environment Variables] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssEnvFunction = require('postcss-env-function');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssEnvFunction(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-env-function --save-dev
```

Use [PostCSS Environment Variables] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-env-function"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-env-function",
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
npm install gulp-postcss postcss-env-function --save-dev
```

Use [PostCSS Environment Variables] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssEnvFunction = require('postcss-env-function');

gulp.task('css', function () {
	var plugins = [
		postcssEnvFunction(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-env-function --save-dev
```

Use [PostCSS Environment Variables] in your Gruntfile:

```js
const postcssEnvFunction = require('postcss-env-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssEnvFunction(/* pluginOptions */)
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
[PostCSS Environment Variables]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-env-function
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
