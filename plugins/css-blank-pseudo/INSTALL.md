# Installing CSS Blank Pseudo

[CSS Blank Pseudo] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [CSS Blank Pseudo] to your project:

```bash
npm install postcss css-blank-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssBlankPseudo = require('css-blank-pseudo');

postcss([
	postcssBlankPseudo(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli css-blank-pseudo --save-dev
```

Use [CSS Blank Pseudo] in your `postcss.config.js` configuration file:

```js
const postcssBlankPseudo = require('css-blank-pseudo');

module.exports = {
	plugins: [
		postcssBlankPseudo(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install css-blank-pseudo --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"css-blank-pseudo": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"css-blank-pseudo": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader css-blank-pseudo --save-dev
```

Use [CSS Blank Pseudo] in your Webpack configuration:

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

Use [React App Rewire PostCSS] and [CSS Blank Pseudo] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssBlankPseudo = require('css-blank-pseudo');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssBlankPseudo(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install css-blank-pseudo --save-dev
```

Use [CSS Blank Pseudo] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"css-blank-pseudo"
	]
}
```

```json5
{
	"plugins": [
		[
			"css-blank-pseudo",
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
npm install gulp-postcss css-blank-pseudo --save-dev
```

Use [CSS Blank Pseudo] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssBlankPseudo = require('css-blank-pseudo');

gulp.task('css', function () {
	var plugins = [
		postcssBlankPseudo(/* pluginOptions */)
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

Use [CSS Blank Pseudo] in your Gruntfile:

```js
const postcssBlankPseudo = require('css-blank-pseudo');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssBlankPseudo(/* pluginOptions */)
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
[CSS Blank Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
