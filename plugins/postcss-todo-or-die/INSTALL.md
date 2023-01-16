# Installing PostCSS Todo or Die

[PostCSS Todo or Die] runs in all Node environments, with special instructions for:

- [Node](#node)
- [PostCSS CLI](#postcss-cli)
- [PostCSS Load Config](#postcss-load-config)
- [Webpack](#webpack)
- [Next.js](#nextjs)
- [Gulp](#gulp)
- [Grunt](#grunt)



## Node

Add [PostCSS Todo or Die] to your project:

```bash
npm install postcss @csstools/postcss-todo-or-die --save-dev
```

Use it as a [PostCSS] plugin:

```js
// commonjs
const postcss = require('postcss');
const postcssTodoOrDie = require('@csstools/postcss-todo-or-die');

postcss([
	postcssTodoOrDie(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

```js
// esm
import postcss from 'postcss';
import postcssTodoOrDie from '@csstools/postcss-todo-or-die';

postcss([
	postcssTodoOrDie(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-todo-or-die --save-dev
```

Use [PostCSS Todo or Die] in your `postcss.config.js` configuration file:

```js
const postcssTodoOrDie = require('@csstools/postcss-todo-or-die');

module.exports = {
	plugins: [
		postcssTodoOrDie(/* pluginOptions */)
	]
}
```

## PostCSS Load Config

If your framework/CLI supports [`postcss-load-config`](https://github.com/postcss/postcss-load-config).

```bash
npm install @csstools/postcss-todo-or-die --save-dev
```

`package.json`:

```json
{
	"postcss": {
		"plugins": {
			"@csstools/postcss-todo-or-die": {}
		}
	}
}
```

`.postcssrc.json`:

```json
{
	"plugins": {
		"@csstools/postcss-todo-or-die": {}
	}
}
```

_See the [README of `postcss-load-config`](https://github.com/postcss/postcss-load-config#usage) for more usage options._

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-todo-or-die --save-dev
```

Use [PostCSS Todo or Die] in your Webpack configuration:

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
										"@csstools/postcss-todo-or-die",
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
npm install @csstools/postcss-todo-or-die --save-dev
```

Use [PostCSS Todo or Die] in your `postcss.config.json` file:

```json
{
	"plugins": [
		"@csstools/postcss-todo-or-die"
	]
}
```

```json5
{
	"plugins": [
		[
			"@csstools/postcss-todo-or-die",
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
npm install gulp-postcss @csstools/postcss-todo-or-die --save-dev
```

Use [PostCSS Todo or Die] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssTodoOrDie = require('@csstools/postcss-todo-or-die');

gulp.task('css', function () {
	var plugins = [
		postcssTodoOrDie(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-todo-or-die --save-dev
```

Use [PostCSS Todo or Die] in your Gruntfile:

```js
const postcssTodoOrDie = require('@csstools/postcss-todo-or-die');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssTodoOrDie(/* pluginOptions */)
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
[PostCSS Todo or Die]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-todo-or-die
[Next.js]: https://nextjs.org
