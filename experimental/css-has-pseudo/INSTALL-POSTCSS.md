# Installing PostCSS

[EXPERIMENTAL CSS Has Pseudo] runs in all Node environments, with special instructions for:

⚠️ Experimental version of [CSS Has Pseudo](https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo)

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [CSS Has Pseudo] to your project:

```bash
npm install css-has-pseudo --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const cssHasPseudoExperimental = require('@csstools/css-has-pseudo-experimental');

postcss([
	cssHasPseudoExperimental(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [CSS Has Pseudo] in your `postcss.config.js` configuration file:

```js
const cssHasPseudoExperimental = require('@csstools/css-has-pseudo-experimental');

module.exports = {
	plugins: [
		cssHasPseudoExperimental(/* pluginOptions */)
	]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [CSS Has Pseudo] in your Webpack configuration:

```js
const cssHasPseudoExperimental = require('@csstools/css-has-pseudo-experimental');

module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{ loader: 'postcss-loader', options: {
						ident: 'postcss',
						plugins: () => [
							cssHasPseudoExperimental(/* pluginOptions */)
						]
					} }
				]
			}
		]
	}
}
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss --save-dev
```

Use [React App Rewire PostCSS] and [CSS Has Pseudo] in your
`config-overrides.js`
file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const cssHasPseudoExperimental = require('@csstools/css-has-pseudo-experimental');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		cssHasPseudoExperimental(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [CSS Has Pseudo] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const cssHasPseudoExperimental = require('@csstools/css-has-pseudo-experimental');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
	postcss([
		cssHasPseudoExperimental(/* pluginOptions */)
	])
).pipe(
	gulp.dest('.')
));
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss --save-dev
```

Use [CSS Has Pseudo] in your Gruntfile:

```js
const cssHasPseudoExperimental = require('@csstools/css-has-pseudo-experimental');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			use: [
			cssHasPseudoExperimental(/* pluginOptions */)
			]
		},
		dist: {
			src: '*.css'
		}
	}
});
```

[EXPERIMENTAL CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/experimental/css-has-pseudo
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
