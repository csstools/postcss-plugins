# Installing PostCSS Font Format Keywords

[PostCSS Font Format Keywords] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Font Format Keywords] to your project:

```bash
npm install postcss @csstools/postcss-font-format-keywords --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssFontFormatKeywords = require('@csstools/postcss-font-format-keywords');

postcss([
	postcssFontFormatKeywords(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssFontFormatKeywords from '@csstools/postcss-font-format-keywords';

postcss([
	postcssFontFormatKeywords(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-font-format-keywords --save-dev
```

Use [PostCSS Font Format Keywords] in your `postcss.config.js` configuration file:

```js
const postcssFontFormatKeywords = require('@csstools/postcss-font-format-keywords');

module.exports = {
	plugins: [
		postcssFontFormatKeywords(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-font-format-keywords --save-dev
```

Use [PostCSS Font Format Keywords] in your Webpack configuration:

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
										"@csstools/postcss-font-format-keywords",
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
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-font-format-keywords --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Font Format Keywords] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssFontFormatKeywords = require('@csstools/postcss-font-format-keywords');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssFontFormatKeywords(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-font-format-keywords --save-dev
```

Use [PostCSS Font Format Keywords] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssFontFormatKeywords = require('@csstools/postcss-font-format-keywords');

gulp.task('css', function () {
	var plugins = [
		postcssFontFormatKeywords(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-font-format-keywords --save-dev
```

Use [PostCSS Font Format Keywords] in your Gruntfile:

```js
const postcssFontFormatKeywords = require('@csstools/postcss-font-format-keywords');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssFontFormatKeywords(/* pluginOptions */)
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
[PostCSS Font Format Keywords]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-font-format-keywords
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
