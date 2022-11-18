# Installing PostCSS Pseudo Class Any Link

[PostCSS Pseudo Class Any Link] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Create React App](#create-react-app)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)

## Node

Add [PostCSS Pseudo Class Any Link] to your project:

```bash
npm install postcss postcss-pseudo-class-any-link --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

postcss([
	postcssPseudoClassAnyLink(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-pseudo-class-any-link --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your `postcss.config.js` configuration file:

```js
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

module.exports = {
	plugins: [
		postcssPseudoClassAnyLink(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-pseudo-class-any-link --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-pseudo-class-any-link": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-pseudo-class-any-link": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-pseudo-class-any-link --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your Webpack configuration:

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
										"postcss-pseudo-class-any-link",
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
npm install react-app-rewired react-app-rewire-postcss postcss-pseudo-class-any-link --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Pseudo Class Any Link] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssPseudoClassAnyLink(/* pluginOptions */)
	]
});
```

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-pseudo-class-any-link --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-pseudo-class-any-link"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-pseudo-class-any-link",
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
npm install gulp-postcss postcss-pseudo-class-any-link --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

gulp.task('css', function () {
	var plugins = [
		postcssPseudoClassAnyLink(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-pseudo-class-any-link --save-dev
```

Use [PostCSS Pseudo Class Any Link] in your Gruntfile:

```js
const postcssPseudoClassAnyLink = require('postcss-pseudo-class-any-link');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssPseudoClassAnyLink(/* pluginOptions */)
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
[PostCSS Pseudo Class Any Link]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-pseudo-class-any-link
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
[Next.js]: https://nextjs.org
