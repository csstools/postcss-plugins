# Installing PostCSS Browser Comments

[PostCSS Browser Comments] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Browser Comments] to your project:

```bash
npm install postcss postcss-browser-comments --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssBrowserComments = require('postcss-browser-comments');

postcss([
	postcssBrowserComments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssBrowserComments from 'postcss-browser-comments';

postcss([
	postcssBrowserComments(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-browser-comments --save-dev
```

Use [PostCSS Browser Comments] in your `postcss.config.js` configuration file:

```js
const postcssBrowserComments = require('postcss-browser-comments');

module.exports = {
	plugins: [
		postcssBrowserComments(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-browser-comments --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-browser-comments": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-browser-comments": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-browser-comments --save-dev
```

Use [PostCSS Browser Comments] in your Webpack configuration:

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
									// Other plugins,
									[
										"postcss-browser-comments",
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

## Next.js

Read the instructions on how to [customize the PostCSS configuration in Next.js](https://nextjs.org/docs/advanced-features/customizing-postcss-config)

```bash
npm install postcss-browser-comments --save-dev
```

Use [PostCSS Browser Comments] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-browser-comments"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-browser-comments",
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
npm install gulp-postcss postcss-browser-comments --save-dev
```

Use [PostCSS Browser Comments] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssBrowserComments = require('postcss-browser-comments');

gulp.task('css', function () {
	var plugins = [
		postcssBrowserComments(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-browser-comments --save-dev
```

Use [PostCSS Browser Comments] in your Gruntfile:

```js
const postcssBrowserComments = require('postcss-browser-comments');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssBrowserComments(/* pluginOptions */)
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
[PostCSS Browser Comments]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-browser-comments
[Next.js]: https://nextjs.org
