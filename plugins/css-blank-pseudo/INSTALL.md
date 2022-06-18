# Installing Blank Pseudo

[Blank Pseudo] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [Blank Pseudo] to your project:

```bash
npm install postcss css-blank-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const blankPseudo = require('css-blank-pseudo');

postcss([
	blankPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli css-blank-pseudo --save-dev
```

Use [Blank Pseudo] in your `postcss.config.js` configuration file:

```js
const blankPseudo = require('css-blank-pseudo');

module.exports = {
	plugins: [
		blankPseudo(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader css-blank-pseudo --save-dev
```

Use [Blank Pseudo] in your Webpack configuration:

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
										"css-blank-pseudo",
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
npm install react-app-rewired react-app-rewire-postcss css-blank-pseudo --save-dev
```

Use [React App Rewire PostCSS] and [Blank Pseudo] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const blankPseudo = require('css-blank-pseudo');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		blankPseudo(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss css-blank-pseudo --save-dev
```

Use [Blank Pseudo] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const blankPseudo = require('css-blank-pseudo');

gulp.task('css', function () {
	var plugins = [
		blankPseudo(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss css-blank-pseudo --save-dev
```

Use [Blank Pseudo] in your Gruntfile:

```js
const blankPseudo = require('css-blank-pseudo');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			blankPseudo(/* pluginOptions */)
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
[Blank Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
