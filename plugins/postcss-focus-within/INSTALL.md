# Installing PostCSS Focus Within

[PostCSS Focus Within] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Focus Within] to your project:

```bash
npm install postcss postcss-focus-within --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFocusWithin = require('postcss-focus-within');

postcss([
	postcssFocusWithin(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] in your `postcss.config.js` configuration file:

```js
const postcssFocusWithin = require('postcss-focus-within');

module.exports = {
	plugins: [
		postcssFocusWithin(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-focus-within --save-dev
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
										"postcss-focus-within",
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
npm install react-app-rewired react-app-rewire-postcss postcss-focus-within --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Focus Within] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssFocusWithin = require('postcss-focus-within');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssFocusWithin(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssFocusWithin = require('postcss-focus-within');

gulp.task('css', function () {
	var plugins = [
		postcssFocusWithin(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] in your Gruntfile:

```js
const postcssFocusWithin = require('postcss-focus-within');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssFocusWithin(/* pluginOptions */)
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
