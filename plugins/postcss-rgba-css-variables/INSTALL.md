# Installing PostCSS rgba-css-variables

[PostCSS rgba-css-variables] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| ------------- | --------------------------- | ------------------- | ------------------------------------- | ------------- | --------------- |

## Node

Add [PostCSS rgba-css-variables] to your project:

```bash
npm install postcss postcss-rgba-css-variables --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require("postcss");
const postcssBasePlugin = require("postcss-rgba-css-variables");

postcss([postcssBasePlugin(/* pluginOptions */)]).process(
	YOUR_CSS /*, processOptions */
);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-rgba-css-variables --save-dev
```

Use [PostCSS rgba-css-variables] in your `postcss.config.js` configuration file:

```js
const postcssBasePlugin = require("postcss-rgba-css-variables");

module.exports = {
	plugins: [postcssBasePlugin(/* pluginOptions */)],
};
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-rgba-css-variables --save-dev
```

Use [PostCSS rgba-css-variables] in your Webpack configuration:

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
										"postcss-rgba-css-variables",
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
npm install react-app-rewired react-app-rewire-postcss postcss-rgba-css-variables --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS rgba-css-variables] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require("react-app-rewire-postcss");
const postcssBasePlugin = require("postcss-rgba-css-variables");

module.exports = (config) =>
	reactAppRewirePostcss(config, {
		plugins: () => [postcssBasePlugin(/* pluginOptions */)],
	});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss postcss-rgba-css-variables --save-dev
```

Use [PostCSS rgba-css-variables] in your Gulpfile:

```js
const postcss = require("gulp-postcss");
const postcssBasePlugin = require("postcss-rgba-css-variables");

gulp.task("css", function () {
	var plugins = [postcssBasePlugin(/* pluginOptions */)];

	return gulp.src("./src/*.css").pipe(postcss(plugins)).pipe(gulp.dest("."));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-rgba-css-variables --save-dev
```

Use [PostCSS rgba-css-variables] in your Gruntfile:

```js
const postcssBasePlugin = require("postcss-rgba-css-variables");

grunt.loadNpmTasks("grunt-postcss");

grunt.initConfig({
	postcss: {
		options: {
			processors: [postcssBasePlugin(/* pluginOptions */)],
		},
		dist: {
			src: "*.css",
		},
	},
});
```

[gulp postcss]: https://github.com/postcss/gulp-postcss
[grunt postcss]: https://github.com/nDmitry/grunt-postcss
[postcss]: https://github.com/postcss/postcss
[postcss cli]: https://github.com/postcss/postcss-cli
[postcss loader]: https://github.com/postcss/postcss-loader
[postcss rgba-css-variables]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rgba-css-variables
[react app rewire postcss]: https://github.com/csstools/react-app-rewire-postcss
[react app rewired]: https://github.com/timarney/react-app-rewired
