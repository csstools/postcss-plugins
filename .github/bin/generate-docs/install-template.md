# Installing <humanReadableName>

[<humanReadableName>] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [<humanReadableName>] to your project:

```bash
npm install postcss <packageName> --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const <exportName> = require('<packageName>');

postcss([
	<exportName>(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import <exportName> from '<packageName>';

postcss([
	<exportName>(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli <packageName> --save-dev
```

Use [<humanReadableName>] in your `postcss.config.js` configuration file:

```js
const <exportName> = require('<packageName>');

module.exports = {
	plugins: [
		<exportName>(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader <packageName> --save-dev
```

Use [<humanReadableName>] in your Webpack configuration:

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
										"<packageName>",
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
npm install react-app-rewired react-app-rewire-postcss <packageName> --save-dev
```

Use [React App Rewire PostCSS] and [<humanReadableName>] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const <exportName> = require('<packageName>');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		<exportName>(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss <packageName> --save-dev
```

Use [<humanReadableName>] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const <exportName> = require('<packageName>');

gulp.task('css', function () {
	var plugins = [
		<exportName>(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss <packageName> --save-dev
```

Use [<humanReadableName>] in your Gruntfile:

```js
const <exportName> = require('<packageName>');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			<exportName>(/* pluginOptions */)
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
[<humanReadableName>]: https://github.com/csstools/postcss-plugins/tree/main/<packagePath>
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
