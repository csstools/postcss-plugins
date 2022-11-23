# Installing PostCSS Custom Media Import/Export

[PostCSS Custom Media Import/Export] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Custom Media Import/Export] to your project:

```bash
npm install postcss @csstools/postcss-custom-media-import-export --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssCustomMediaImportExport = require('@csstools/postcss-custom-media-import-export');

postcss([
	postcssCustomMediaImportExport(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssCustomMediaImportExport from '@csstools/postcss-custom-media-import-export';

postcss([
	postcssCustomMediaImportExport(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-custom-media-import-export --save-dev
```

Use [PostCSS Custom Media Import/Export] in your `postcss.config.js` configuration file:

```js
const postcssCustomMediaImportExport = require('@csstools/postcss-custom-media-import-export');

module.exports = {
	plugins: [
		postcssCustomMediaImportExport(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-custom-media-import-export --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-custom-media-import-export": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-custom-media-import-export": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-custom-media-import-export --save-dev
```

Use [PostCSS Custom Media Import/Export] in your Webpack configuration:

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
										"@csstools/postcss-custom-media-import-export",
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
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-custom-media-import-export --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Custom Media Import/Export] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssCustomMediaImportExport = require('@csstools/postcss-custom-media-import-export');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssCustomMediaImportExport(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install @csstools/postcss-custom-media-import-export --save-dev
```

Use [PostCSS Custom Media Import/Export] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-custom-media-import-export"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-custom-media-import-export",
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
npm install gulp-postcss @csstools/postcss-custom-media-import-export --save-dev
```

Use [PostCSS Custom Media Import/Export] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssCustomMediaImportExport = require('@csstools/postcss-custom-media-import-export');

gulp.task('css', function () {
	var plugins = [
		postcssCustomMediaImportExport(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-custom-media-import-export --save-dev
```

Use [PostCSS Custom Media Import/Export] in your Gruntfile:

```js
const postcssCustomMediaImportExport = require('@csstools/postcss-custom-media-import-export');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssCustomMediaImportExport(/* pluginOptions */)
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
[PostCSS Custom Media Import/Export]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media-import-export
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
