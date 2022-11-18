# Installing PostCSS Color Functional Notation

[PostCSS Color Functional Notation] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Color Functional Notation] to your project:

```bash
npm install postcss postcss-color-functional-notation --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

postcss([
	postcssColorFunctionalNotation(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-color-functional-notation --save-dev
```

Use [PostCSS Color Functional Notation] in your `postcss.config.js` configuration file:

```js
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

module.exports = {
	plugins: [
		postcssColorFunctionalNotation(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-color-functional-notation --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-color-functional-notation": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-color-functional-notation": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-color-functional-notation --save-dev
```

Use [PostCSS Color Functional Notation] in your Webpack configuration:

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
										"postcss-color-functional-notation",
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
npm install react-app-rewired react-app-rewire-postcss postcss-color-functional-notation --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Color Functional Notation] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssColorFunctionalNotation(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-color-functional-notation --save-dev
```

Use [PostCSS Color Functional Notation] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-color-functional-notation"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-color-functional-notation",
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
npm install gulp-postcss postcss-color-functional-notation --save-dev
```

Use [PostCSS Color Functional Notation] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

gulp.task('css', function () {
	var plugins = [
		postcssColorFunctionalNotation(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-color-functional-notation --save-dev
```

Use [PostCSS Color Functional Notation] in your Gruntfile:

```js
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssColorFunctionalNotation(/* pluginOptions */)
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
[PostCSS Color Functional Notation]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-functional-notation
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
