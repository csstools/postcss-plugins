# Installing PostCSS Scope Pseudo Class

[PostCSS Scope Pseudo Class] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Scope Pseudo Class] to your project:

```bash
npm install postcss @csstools/postcss-scope-pseudo-class --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssScopePseudoClass = require('@csstools/postcss-scope-pseudo-class');

postcss([
	postcssScopePseudoClass(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssScopePseudoClass from '@csstools/postcss-scope-pseudo-class';

postcss([
	postcssScopePseudoClass(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-scope-pseudo-class --save-dev
```

Use [PostCSS Scope Pseudo Class] in your `postcss.config.js` configuration file:

```js
const postcssScopePseudoClass = require('@csstools/postcss-scope-pseudo-class');

module.exports = {
	plugins: [
		postcssScopePseudoClass(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-scope-pseudo-class --save-dev
```

Use [PostCSS Scope Pseudo Class] in your Webpack configuration:

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
										"@csstools/postcss-scope-pseudo-class",
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
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-scope-pseudo-class --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Scope Pseudo Class] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssScopePseudoClass = require('@csstools/postcss-scope-pseudo-class');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssScopePseudoClass(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-scope-pseudo-class --save-dev
```

Use [PostCSS Scope Pseudo Class] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssScopePseudoClass = require('@csstools/postcss-scope-pseudo-class');

gulp.task('css', function () {
	var plugins = [
		postcssScopePseudoClass(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-scope-pseudo-class --save-dev
```

Use [PostCSS Scope Pseudo Class] in your Gruntfile:

```js
const postcssScopePseudoClass = require('@csstools/postcss-scope-pseudo-class');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssScopePseudoClass(/* pluginOptions */)
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
[PostCSS Scope Pseudo Class]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-scope-pseudo-class
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
