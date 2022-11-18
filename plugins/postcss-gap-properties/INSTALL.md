# Installing PostCSS Gap Properties

[PostCSS Gap Properties] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Gap Properties] to your project:

```bash
npm install postcss postcss-gap-properties --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssGapProperties = require('postcss-gap-properties');

postcss([
	postcssGapProperties(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-gap-properties --save-dev
```

Use [PostCSS Gap Properties] in your `postcss.config.js` configuration file:

```js
const postcssGapProperties = require('postcss-gap-properties');

module.exports = {
	plugins: [
		postcssGapProperties(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-gap-properties --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-gap-properties": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-gap-properties": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-gap-properties --save-dev
```

Use [PostCSS Gap Properties] in your Webpack configuration:

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
										"postcss-gap-properties",
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
npm install react-app-rewired react-app-rewire-postcss postcss-gap-properties --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Gap Properties] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssGapProperties = require('postcss-gap-properties');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssGapProperties(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-gap-properties --save-dev
```

Use [PostCSS Gap Properties] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-gap-properties"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-gap-properties",
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
npm install gulp-postcss postcss-gap-properties --save-dev
```

Use [PostCSS Gap Properties] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssGapProperties = require('postcss-gap-properties');

gulp.task('css', function () {
	var plugins = [
		postcssGapProperties(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-gap-properties --save-dev
```

Use [PostCSS Gap Properties] in your Gruntfile:

```js
const postcssGapProperties = require('postcss-gap-properties');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssGapProperties(/* pluginOptions */)
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
[PostCSS Gap Properties]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-gap-properties
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
