# PostCSS Cascade Layers [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-cascade-layers.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/cascade-layers.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Cascade Layers] lets use `@layer` following the [Cascade Layers Specification].

```pcss

target {
	color: purple;
}

@layer {
	target {
		color: green;
	}
}


/* becomes */


target:not(#\#) {
	color: purple;
}

target {
		color: green;
	}

```

## Usage

Add [PostCSS Cascade Layers] to your project:

```bash
npm install postcss @csstools/postcss-cascade-layers --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCascadeLayers = require('@csstools/postcss-cascade-layers');

postcss([
	postcssCascadeLayers(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Cascade Layers] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### onRevertLayerKeyword

The `onRevertLayerKeyword` option enables warnings if `revert-layer` is used.
Transforming `revert-layer` for older browsers is not possible in this plugin.

Defaults to `warn`

```js
postcssCascadeLayers({ onRevertLayerKeyword: 'warn' }) // 'warn' | false
```

```pcss
/* [postcss-cascade-layers]: handling "revert-layer" is unsupported by this plugin and will cause style differences between browser versions. */
@layer {
	.foo {
		color: revert-layer;
	}
}
```

### onMixedLayerOrder

The `onMixedLayerOrder` option enables warnings if layers are declared in multiple different orders in conditional rules.
Transforming these layers correctly for older browsers is not possible in this plugin.

Defaults to `warn`

```js
postcssCascadeLayers({ onMixedLayerOrder: 'warn' }) // 'warn' | false
```

```pcss
/* [postcss-cascade-layers]: handling different layer orders in conditional rules is unsupported by this plugin and will cause style differences between browser versions. */
@media (min-width: 10px) {
	@layer B {
		.foo {
			color: red;
		}
	}
}

@layer A {
	.foo {
		color: pink;
	}
}

@layer B {
	.foo {
		color: red;
	}
}
```

<!-- TODO : Add a reference to oddbird for doing all the heavy lifting -->

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#cascade-layers
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-cascade-layers

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Cascade Layers]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-cascade-layers
[Cascade Layers Specification]: https://www.w3.org/TR/css-cascade-5/#layering
