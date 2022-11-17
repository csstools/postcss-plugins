# Installing PostCSS Attribute Case Insensitive

[PostCSS Attribute Case Insensitive] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Attribute Case Insensitive] to your project:

```bash
npm install postcss postcss-attribute-case-insensitive --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssAttributeCaseInsensitive = require('postcss-attribute-case-insensitive');

postcss([
	postcssAttributeCaseInsensitive(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-attribute-case-insensitive --save-dev
```

Use [PostCSS Attribute Case Insensitive] in your `postcss.config.js` configuration file:

```js
const postcssAttributeCaseInsensitive = require('postcss-attribute-case-insensitive');

module.exports = {
	plugins: [
		postcssAttributeCaseInsensitive(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-attribute-case-insensitive --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-attribute-case-insensitive": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-attribute-case-insensitive": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-attribute-case-insensitive --save-dev
```

Use [PostCSS Attribute Case Insensitive] in your Webpack configuration:

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
										"postcss-attribute-case-insensitive",
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
npm install react-app-rewired react-app-rewire-postcss postcss-attribute-case-insensitive --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Attribute Case Insensitive] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssAttributeCaseInsensitive = require('postcss-attribute-case-insensitive');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssAttributeCaseInsensitive(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-attribute-case-insensitive --save-dev
```

Use [PostCSS Attribute Case Insensitive] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-attribute-case-insensitive"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-attribute-case-insensitive",
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
npm install gulp-postcss postcss-attribute-case-insensitive --save-dev
```

Use [PostCSS Attribute Case Insensitive] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssAttributeCaseInsensitive = require('postcss-attribute-case-insensitive');

gulp.task('css', function () {
	var plugins = [
		postcssAttributeCaseInsensitive(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-attribute-case-insensitive --save-dev
```

Use [PostCSS Attribute Case Insensitive] in your Gruntfile:

```js
const postcssAttributeCaseInsensitive = require('postcss-attribute-case-insensitive');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssAttributeCaseInsensitive(/* pluginOptions */)
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
[PostCSS Attribute Case Insensitive]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-attribute-case-insensitive
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
