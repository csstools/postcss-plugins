# PostCSS Custom Shorthands Experimental [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-custom-shorthands-experimental.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Shorthands Experimental] lets you try out custom shorthands in CSS to give feedback on the [Proposed feature].

⚠️ This is not a feature that is on a standard track. ⚠️

Please do not use this in real projects.
It is intended to try out the feature to see if it is useful.

```pcss
@csstools-shorthand-property --some-shorthand {
	syntax:
		"a"
		"b b"
		"c";
	constituent-properties: color padding display;
	values:
		default / purple 20px 10px block,
		fancy / hotpink 15px 30px flex;
}

.a {
	--some-shorthand: fancy;
}

/* becomes */

.a {
	color: hotpink;
	padding: 15px 30px;
	display: flex;
}
```

## Usage

Add [PostCSS Custom Shorthands Experimental] to your project:

```bash
npm install postcss @csstools/postcss-custom-shorthands-experimental --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomShorthandsExperimental = require('@csstools/postcss-custom-shorthands-experimental');

postcss([
	postcssCustomShorthandsExperimental(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Shorthands Experimental] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### experimentalVersion

The `experimentalVersion` option determines which proposal you are using.
The latest proposal is mostly the default. (currently `2`)

- 1 : https://github.com/w3c/csswg-drafts/issues/7879#issue-1407763311
- 2 : https://github.com/w3c/csswg-drafts/issues/7879#issuecomment-1279688467

```js
postcssCustomShorthandsExperimental({ experimentalVersion: 1 })
```

```pcss
@csstools-shorthand-property --some-shorthand {
	syntax:
		"<color>"
		"<length> <length>"
		"[ flex | block ]";
	constituent-properties: color padding display;
	values:
		default / purple 20px 10px block,
		fancy / hotpink 15px 30px flex;
}

.a {
	--some-shorthand: fancy;
}

/* becomes */

.a {
	color: hotpink;
	padding: 15px 30px;
	display: flex;
}
```

### atRuleName

The `atRuleName` option determines the At Rule name.
This feature is just a random thought by one person and not in any way on a standards track.
To avoid conflicts with current and future standard CSS we use vendor prefixes (`@csstools-shorthand-property`).

This option lets you pick an At Rule name that works for you.

```js
postcssCustomShorthandsExperimental({ atRuleName: 'my-shorthand-property' })
```

### generateVSCodeCustomDataInDirectory

The proposed feature can be abused to make stylesheets very hard to read and edit.
More so than other features.

We believe that editor support is critical to compensate for this.
To illustrate some of the benefits you can generate [custom data for VSCode](https://code.visualstudio.com/blogs/2020/02/24/custom-data-format).
This gives you limited editor support and hover help.

```js
postcssCustomShorthandsExperimental({ generateVSCodeCustomDataInDirectory: './.vscode/' })
```

```json
{
	"css.customData": [
		"../.vscode/custom-shorthands.css-data.json"
	]
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-custom-shorthands-experimental

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Custom Shorthands Experimental]: https://github.com/csstools/postcss-plugins/tree/main/experimental/postcss-custom-shorthands
[Proposed feature]: https://github.com/w3c/csswg-drafts/issues/7879
