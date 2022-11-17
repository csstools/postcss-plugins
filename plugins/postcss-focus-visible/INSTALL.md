# Installing PostCSS Focus Visible

[PostCSS Focus Visible] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Focus Visible] to your project:

```bash
npm install postcss postcss-focus-visible --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFocusVisible = require('postcss-focus-visible');

postcss([
	postcssFocusVisible(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-focus-visible --save-dev
```

Use [PostCSS Focus Visible] in your `postcss.config.js` configuration file:

```js
const postcssFocusVisible = require('postcss-focus-visible');

module.exports = {
	plugins: [
		postcssFocusVisible(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-focus-visible --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-focus-visible": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-focus-visible": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-focus-visible --save-dev
```

Use [PostCSS Focus Visible] in your Webpack configuration:

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
										"postcss-focus-visible",
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
npm install react-app-rewired react-app-rewire-postcss postcss-focus-visible --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Focus Visible] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssFocusVisible = require('postcss-focus-visible');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssFocusVisible(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-focus-visible --save-dev
```

Use [PostCSS Focus Visible] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-focus-visible"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-focus-visible",
			{
				// Optionally add plugin options
			}
		]
	]
}
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss postcss-focus-visible --save-dev
```

Use [PostCSS Focus Visible] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssFocusVisible = require('postcss-focus-visible');

gulp.task('css', function () {
	var plugins = [
		postcssFocusVisible(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-focus-visible --save-dev
```

Use [PostCSS Focus Visible] in your Gruntfile:

```js
const postcssFocusVisible = require('postcss-focus-visible');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssFocusVisible(/* pluginOptions */)
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
[PostCSS Focus Visible]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-focus-visible
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
