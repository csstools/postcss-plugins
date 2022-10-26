# PostCSS rgba-css-variables [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[PostCSS rgba-css-variables] lets you easily support `css variable` when use `rgba`.

If you enter this,

```pcss
:root {
	--width: 100px;
	--color: rgb(255, 0, 0);
	--bg-color: #555;
}

html {
	--s-color: rgb(255, 255, 0);
	--s-bg-color: #999;
	color: rgba(0, 0, 0, 0.3);
}

.header {
	width: var(--width);
	height: 80px;
	color: rgba(var(--color), 0.6);
	color: rgba(255, 0, 0, 0.6);
	background-color: rgba(var(--bg-color), 0.4);
	background-color: rgba(85, 85, 85, 0.4);
}

.footer {
	--s-color: #eee;
	--ccc-color: var(--bg-color);
	--s-bg-color: var(--ccc-color);
	color: rgba(var(--s-color), 0.3);
	color: rgba(238, 238, 238, 0.3);
	background-color: rgba(var(--s-bg-color), 0.7);
	background-color: rgba(85, 85, 85, 0.7);
}

.aaa {
	color: rgba(var(--color), 0.4);
	color: rgba(255, 0, 0, 0.4);
}

.bbb {
	color: rgba(var(--color, blue), 0.4);
	color: rgba(255, 0, 0, 0.4);
}

.ccc {
	--opacity: 0.5;
	color: rgba(var(--color), var(--opacity));
}

.ddd {
	--opacity: 0.5;
	--color-r: 255;
	--color-g: 0;
	--color-b: 0;
	color: rgba(var(--color-r), var(--color-g), var(--color-b), var(--opacity));
}
```

then you will get:

```pcss
:root {
	--width: 100px;
	--color: rgb(255, 0, 0);
	--bg-color: #555;
}

html {
	--s-color: rgb(255, 255, 0);
	--s-bg-color: #999;
	color: rgba(0, 0, 0, 0.3);
}

.header {
	width: var(--width);
	height: 80px;
	color: rgba(var(--color), 0.6);
	color: rgba(255, 0, 0, 0.6);
	background-color: rgba(var(--bg-color), 0.4);
	background-color: rgba(85, 85, 85, 0.4);
}

.footer {
	--s-color: #eee;
	--ccc-color: var(--bg-color);
	--s-bg-color: var(--ccc-color);
	color: rgba(var(--s-color), 0.3);
	color: rgba(238, 238, 238, 0.3);
	background-color: rgba(var(--s-bg-color), 0.7);
	background-color: rgba(85, 85, 85, 0.7);
}

.aaa {
	color: rgba(var(--color), 0.4);
	color: rgba(255, 0, 0, 0.4);
}

.bbb {
	color: rgba(var(--color, blue), 0.4);
	color: rgba(255, 0, 0, 0.4);
}

.ccc {
	--opacity: 0.5;
	color: rgba(var(--color), var(--opacity));
}

.ddd {
	--opacity: 0.5;
	--color-r: 255;
	--color-g: 0;
	--color-b: 0;
	color: rgba(var(--color-r), var(--color-g), var(--color-b), var(--opacity));
}
```

## Usage

Add [PostCSS rgba-css-variables] to your project:

```bash
npm install postcss postcss-rgba-css-variables --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require("postcss");
const postcssRgbaCssVariables = require("postcss-rgba-css-variables");

postcss([postcssRgbaCssVariables(/* pluginOptions */)]).process(
	YOUR_CSS /*, processOptions */
);
```

## Options

### mode

- optional: "replace-directly" | "replace-required" | "replace-all"
- default: "replace-directly"

`replace-directly` will replace all css variables which used in rgba :

```pcss
:root {
	--color: #000;
	--default-color: #fff;
}

div {
	background-color: rgba(var(--color), 0.3);
}

/** will become */
:root {
	--color: #000;
	--default-color: #fff;
}

div {
	background-color: rgba(0, 0, 0, 0.3);
}
```

`replace-required` will use `xxx-rgb` replace all css variables which used in rgba :

```pcss
:root {
	--color: #000;
	--default-color: #fff;
}

div {
	background-color: rgba(var(--color), 0.3);
}

/** will become */
:root {
	--color: #000;
	--color-rgb: 0, 0, 0;
	--default-color: #fff;
}

div {
	background-color: rgba(var(--color-rgb), 0.3);
}
```

`replace-all` will change all css variables whether it was used. This mode can be used when you want change css variables in browser.

```pcss
:root {
	--color: #000;
	--default-color: #fff;
}

div {
	background-color: rgba(var(--color), 0.3);
}

/** will become */
:root {
	--color: #000;
	--color-rgb: 0, 0, 0;
	--default-color: #fff;
	--default-color-rgb: 255, 255, 255;
}

div {
	background-color: rgba(var(--color-rgb), 0.3);
}
```

```js
let root = document.documentElement;

root.style.setProperty("--color", "red");
root.style.setProperty("--color-rgb", "255, 0, 0");
root.style.setProperty("--default-color", "green");
root.style.setProperty("--default-color-rgb", "0, 255, 0");
```

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is preserved.

```js
postcssRgbaCssVariables({ preserve: false });
```

```pcss
:root {
	--color: #000;
	--default-color: #fff;
}

div {
	background-color: rgba(var(--color), 0.3);
}

/** will become */
:root {
	--color: #000;
	--default-color: #fff;
}

div {
	background-color: rgba(var(--color), 0.3);
	background-color: rgba(0, 0, 0, 0.3);
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#TODO
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-rgba-css-variables
[gulp postcss]: https://github.com/postcss/gulp-postcss
[grunt postcss]: https://github.com/nDmitry/grunt-postcss
[postcss]: https://github.com/postcss/postcss
[postcss loader]: https://github.com/postcss/postcss-loader
[postcss rgba-css-variables]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-rgba-css-variables
[css specification]: #TODO
