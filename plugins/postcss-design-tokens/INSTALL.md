# Installing PostCSS Design Tokens

[PostCSS Design Tokens] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Design Tokens] to your project:

```bash
npm install postcss @csstools/postcss-design-tokens --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssDesignTokens = require('@csstools/postcss-design-tokens');

postcss([
	postcssDesignTokens(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssDesignTokens from '@csstools/postcss-design-tokens';

postcss([
	postcssDesignTokens(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-design-tokens --save-dev
```

Use [PostCSS Design Tokens] in your `postcss.config.js` configuration file:

```js
const postcssDesignTokens = require('@csstools/postcss-design-tokens');

module.exports = {
	plugins: [
		postcssDesignTokens(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-design-tokens --save-dev
```

Use [PostCSS Design Tokens] in your Webpack configuration:

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
										"@csstools/postcss-design-tokens",
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
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-design-tokens --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Design Tokens] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssDesignTokens = require('@csstools/postcss-design-tokens');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssDesignTokens(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-design-tokens --save-dev
```

Use [PostCSS Design Tokens] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssDesignTokens = require('@csstools/postcss-design-tokens');

gulp.task('css', function () {
	var plugins = [
		postcssDesignTokens(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-design-tokens --save-dev
```

Use [PostCSS Design Tokens] in your Gruntfile:

```js
const postcssDesignTokens = require('@csstools/postcss-design-tokens');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssDesignTokens(/* pluginOptions */)
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
[PostCSS Design Tokens]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-design-tokens
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
