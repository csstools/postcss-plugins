# Installing PostCSS Overflow Shorthand

[PostCSS Overflow Shorthand] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Overflow Shorthand] to your project:

```bash
npm install postcss postcss-overflow-shorthand --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

postcss([
	postcssOverflowShorthand(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-overflow-shorthand --save-dev
```

Use [PostCSS Overflow Shorthand] in your `postcss.config.js` configuration file:

```js
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

module.exports = {
	plugins: [
		postcssOverflowShorthand(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-overflow-shorthand --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-overflow-shorthand": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-overflow-shorthand": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-overflow-shorthand --save-dev
```

Use [PostCSS Overflow Shorthand] in your Webpack configuration:

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
										"postcss-overflow-shorthand",
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
npm install react-app-rewired react-app-rewire-postcss postcss-overflow-shorthand --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Overflow Shorthand] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssOverflowShorthand(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-overflow-shorthand --save-dev
```

Use [PostCSS Overflow Shorthand] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-overflow-shorthand"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-overflow-shorthand",
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
npm install gulp-postcss postcss-overflow-shorthand --save-dev
```

Use [PostCSS Overflow Shorthand] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

gulp.task('css', function () {
	var plugins = [
		postcssOverflowShorthand(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-overflow-shorthand --save-dev
```

Use [PostCSS Overflow Shorthand] in your Gruntfile:

```js
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssOverflowShorthand(/* pluginOptions */)
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
[PostCSS Overflow Shorthand]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-overflow-shorthand
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
