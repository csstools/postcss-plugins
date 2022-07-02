# Installing PostCSS Focus Within

[PostCSS Focus Within] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Focus Within] to your project:

```bash
npm install postcss @csstools/postcss-focus-within --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBasePlugin = require('@csstools/postcss-focus-within');

postcss([
	postcssBasePlugin(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] in your `postcss.config.js` configuration file:

```js
const postcssBasePlugin = require('@csstools/postcss-focus-within');

module.exports = {
	plugins: [
		postcssBasePlugin(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] in your Webpack configuration:

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
										"@csstools/postcss-focus-within",
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
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-focus-within --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Focus Within] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssBasePlugin = require('@csstools/postcss-focus-within');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssBasePlugin(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssBasePlugin = require('@csstools/postcss-focus-within');

gulp.task('css', function () {
	var plugins = [
		postcssBasePlugin(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] in your Gruntfile:

```js
const postcssBasePlugin = require('@csstools/postcss-focus-within');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssBasePlugin(/* pluginOptions */)
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
[PostCSS Focus Within]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-focus-within
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
