# Installing PostCSS Gradients Interpolation Method

[PostCSS Gradients Interpolation Method] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Gradients Interpolation Method] to your project:

```bash
npm install postcss @csstools/postcss-gradients-interpolation-method --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssGradientsInterpolationMethod = require('@csstools/postcss-gradients-interpolation-method');

postcss([
	postcssGradientsInterpolationMethod(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-gradients-interpolation-method --save-dev
```

Use [PostCSS Gradients Interpolation Method] in your `postcss.config.js` configuration file:

```js
const postcssGradientsInterpolationMethod = require('@csstools/postcss-gradients-interpolation-method');

module.exports = {
	plugins: [
		postcssGradientsInterpolationMethod(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-gradients-interpolation-method --save-dev
```

Use [PostCSS Gradients Interpolation Method] in your Webpack configuration:

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
										"@csstools/postcss-gradients-interpolation-method",
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
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-gradients-interpolation-method --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Gradients Interpolation Method] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssGradientsInterpolationMethod = require('@csstools/postcss-gradients-interpolation-method');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssGradientsInterpolationMethod(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-gradients-interpolation-method --save-dev
```

Use [PostCSS Gradients Interpolation Method] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssGradientsInterpolationMethod = require('@csstools/postcss-gradients-interpolation-method');

gulp.task('css', function () {
	var plugins = [
		postcssGradientsInterpolationMethod(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-gradients-interpolation-method --save-dev
```

Use [PostCSS Gradients Interpolation Method] in your Gruntfile:

```js
const postcssGradientsInterpolationMethod = require('@csstools/postcss-gradients-interpolation-method');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssGradientsInterpolationMethod(/* pluginOptions */)
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
[PostCSS Gradients Interpolation Method]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-gradients-interpolation-method
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
