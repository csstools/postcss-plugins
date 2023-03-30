# Installing PostCSS Preset Env

[PostCSS Preset Env] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Preset Env] to your project:

```bash
npm install postcss postcss-preset-env --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');

postcss([
	postcssPresetEnv(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

postcss([
	postcssPresetEnv(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli postcss-preset-env --save-dev
```

Use [PostCSS Preset Env] in your `postcss.config.js` configuration file:

```js
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
	plugins: [
		postcssPresetEnv(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install postcss-preset-env --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"postcss-preset-env": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"postcss-preset-env": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader postcss-preset-env --save-dev
```

Use [PostCSS Preset Env] in your Webpack configuration:

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
										"postcss-preset-env",
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
npm install postcss-preset-env --save-dev
```

Use [PostCSS Preset Env] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"postcss-preset-env"
	]
}
```

```json5
{
	"plugins": [
		[
			"postcss-preset-env",
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
npm install gulp-postcss postcss-preset-env --save-dev
```

Use [PostCSS Preset Env] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');

gulp.task('css', function () {
	var plugins = [
		postcssPresetEnv(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss postcss-preset-env --save-dev
```

Use [PostCSS Preset Env] in your Gruntfile:

```js
const postcssPresetEnv = require('postcss-preset-env');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssPresetEnv(/* pluginOptions */)
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
[PostCSS Preset Env]: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
[Next.js]: https://nextjs.org
