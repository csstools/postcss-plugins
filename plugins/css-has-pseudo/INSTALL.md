# Installing PostCSS Has Pseudo

[PostCSS Has Pseudo] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Has Pseudo] to your project:

```bash
npm install postcss css-has-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssHasPseudo = require('css-has-pseudo');

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

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss css-has-pseudo --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Has Pseudo] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssHasPseudo = require('css-has-pseudo');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssHasPseudo(/* pluginOptions */)
	]
});
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
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
