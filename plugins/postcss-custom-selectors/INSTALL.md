# Installing PostCSS Custom Selectors

[PostCSS Custom Selectors] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Custom Selectors] to your project:

```bash
npm install postcss postcss-custom-selectors --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssCustomSelectors = require('postcss-custom-selectors');

postcss([
	postcssCustomSelectors(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssCustomSelectors from 'postcss-custom-selectors';

postcss([
	postcssCustomSelectors(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-custom-selectors --save-dev
```

Use [PostCSS Custom Selectors] in your `postcss.config.js` configuration file:

```js
const postcssCustomSelectors = require('postcss-custom-selectors');

module.exports = {
	plugins: [
		postcssCustomSelectors(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-custom-selectors --save-dev
```

Use [PostCSS Custom Selectors] in your Webpack configuration:

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
										"postcss-custom-selectors",
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
npm install react-app-rewired react-app-rewire-postcss postcss-custom-selectors --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Custom Selectors] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssCustomSelectors = require('postcss-custom-selectors');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssCustomSelectors(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss postcss-custom-selectors --save-dev
```

Use [PostCSS Custom Selectors] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssCustomSelectors = require('postcss-custom-selectors');

gulp.task('css', function () {
	var plugins = [
		postcssCustomSelectors(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-custom-selectors --save-dev
```

Use [PostCSS Custom Selectors] in your Gruntfile:

```js
const postcssCustomSelectors = require('postcss-custom-selectors');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssCustomSelectors(/* pluginOptions */)
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
[PostCSS Custom Selectors]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-selectors
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
