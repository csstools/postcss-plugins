# PostCSS Conditional Values [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-conditional-values.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Conditional Values] lets you easily apply space toggle hacks with some syntactic sugar.

This plugin adds a non-standard function : `csstools-if( else )` which acts as a ternary operator.

`csstools-if(--a-variable <value-when-true> else <value-when-false>)`

You control the outcome by setting `--a-variable` to `true` and `false`.

```pcss
.fancy-container {
	--is-fancy: true;
}

.block {
	color: csstools-if(--is-fancy pink else red);
}

/* becomes */

:root {
	--is-fancy:  ;
}

.fancy-container {
	--is-fancy: initial;
}

.block {
	--is-fancy--0: var(--is-fancy) red;
	color: var(--is-fancy--0,pink);
}
```

For more information on how the trick works, you can read more on these articles:

- [The CSS Custom Property Toggle Trick](https://css-tricks.com/the-css-custom-property-toggle-trick/)
- [The -​-var: ; hack to toggle multiple values with one custom property](https://lea.verou.me/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/)

## Usage

Add [PostCSS Conditional Values] to your project:

```bash
npm install postcss @csstools/postcss-conditional-values --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssConditionalValues = require('@csstools/postcss-conditional-values');

postcss([
	postcssConditionalValues(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Conditional Values] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Create React App](INSTALL.md#create-react-app)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### functionName

The `functionName` option allows you to set a custom alias for `csstools-if`.

```js
postcssConditionalValues({ functionName: 'if' })
```

```pcss
.fancy-container {
	--is-fancy: true;
}

.block {
	color: if(--is-fancy pink else red);
}

/* becomes */

:root {
	--is-fancy:  ;
}

.fancy-container {
	--is-fancy: initial;
}

.block {
	--is-fancy--0: var(--is-fancy) red;
	color: var(--is-fancy--0,pink);
}
```

## Syntax

### `csstools-if else` function

The `csstools-if else` function is used to declare which values must be used when a condition is true or false.

```pcss
color: csstools-if(--a-condition yellow else red);
```

```
csstools-if(<custom-property-name> <declaration-value> else <declaration-value>);
```

### `true` and `false` keywords

The `true` and `false` keywords are syntactic sugar for `initial` and `<space>`.

```pcss
--a-condition: true;

/* becomes */

--a-condition: initial;
```

```pcss
--a-condition: false;

/* becomes */

--a-condition:  ;
```

You can manually toggle the condition with `initial` and `<space>`.
This makes it possible to control the outcome of conditions with javascript, inline styles, ...

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-conditional-values

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Conditional Values]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-conditional-values
